# Lead Pipeline Feature - Backend Implementation Spec

## Overview
Add pipeline/CRM functionality to allow users to track leads through customizable sales stages. Users can rename stages, change colors, reorder them, or add/remove stages via settings.

---

## Database Changes

### 1. User Pipeline Settings (Store in User model)

Add pipeline configuration to the User schema in `/src/user/user.model.ts`:

```typescript
// Add this interface
export interface PipelineStageConfig {
  id: string;        // Unique ID (e.g., 'stage_1', 'stage_2')
  name: string;      // Display name (e.g., 'New', 'Contacted', 'Hot Lead')
  color: string;     // Hex color (e.g., '#3B82F6', '#10B981')
  order: number;     // Sort order (1, 2, 3...)
}

// Add to UserSchema
pipelineStages: [{
  id: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, default: '#6B7280' },
  order: { type: Number, required: true },
}],
```

**Default stages** (created when user first accesses pipeline):
```typescript
const DEFAULT_PIPELINE_STAGES: PipelineStageConfig[] = [
  { id: 'new', name: 'New', color: '#6B7280', order: 1 },
  { id: 'contacted', name: 'Contacted', color: '#3B82F6', order: 2 },
  { id: 'appointment', name: 'Appointment', color: '#F59E0B', order: 3 },
  { id: 'listed', name: 'Listed', color: '#10B981', order: 4 },
  { id: 'sold', name: 'Sold!', color: '#8B5CF6', order: 5 },
];
```

### 2. Lead Pipeline Data (Extend MyLeadSchema)

Update `/src/lead/my-lead.model.ts`:

```typescript
export const MyLeadSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      index: true,
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: true,
    },
    // PIPELINE FIELDS
    pipelineStageId: {
      type: String,       // References user's pipelineStages[].id
      default: null,
      index: true,
    },
    pipelineUpdatedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);
```

---

## API Endpoints

### 1. Get User's Pipeline Configuration
**GET** `/user/pipeline-settings`

Returns the user's custom pipeline stages.

```typescript
// Response
{
  stages: [
    { id: 'new', name: 'New', color: '#6B7280', order: 1 },
    { id: 'contacted', name: 'Contacted', color: '#3B82F6', order: 2 },
    { id: 'hot', name: 'Hot Lead 🔥', color: '#EF4444', order: 3 },
    { id: 'appointment', name: 'Appt Booked', color: '#F59E0B', order: 4 },
    { id: 'listed', name: 'Listed', color: '#10B981', order: 5 },
    { id: 'sold', name: 'Sold!', color: '#8B5CF6', order: 6 },
  ]
}
```

### 2. Update User's Pipeline Configuration
**PUT** `/user/pipeline-settings`

Allows user to customize their pipeline stages.

```typescript
// Request body
{
  stages: [
    { id: 'new', name: 'Fresh Lead', color: '#3B82F6', order: 1 },
    { id: 'contacted', name: 'Made Contact', color: '#10B981', order: 2 },
    // ... etc
  ]
}
```

```typescript
// In user.controller.ts

@Put('pipeline-settings')
@Roles({
  role: Role.BUSINESS,
  registrationStatus: [UserRegistrationStatus.COMPLETED],
})
async updatePipelineSettings(
  @Req() req,
  @Body() body: { stages: PipelineStageConfig[] },
) {
  // Validate: each stage needs id, name, color, order
  // Validate: ids must be unique
  // Validate: orders must be unique and sequential
  return await this.userService.updatePipelineSettings(req.user._id, body.stages);
}
```

### 3. Update Lead Pipeline Stage
**PATCH** `/lead/:leadId/pipeline`

```typescript
// Request body
{
  stageId: 'contacted',  // References user's stage ID
  notes: 'Left voicemail, will call back tomorrow'
}

// Response
{
  success: true,
  lead: { ... },
  stage: { id: 'contacted', name: 'Contacted', color: '#3B82F6', order: 2 }
}
```

### 4. Get Pipeline Summary
**GET** `/lead/pipeline/summary`

Returns count of leads in each of the user's custom stages.

```typescript
// Response (uses user's custom stage IDs)
{
  stages: [
    { id: 'new', name: 'Fresh Lead', color: '#3B82F6', count: 45 },
    { id: 'contacted', name: 'Made Contact', color: '#10B981', count: 23 },
    { id: 'hot', name: 'Hot Lead 🔥', color: '#EF4444', count: 8 },
    { id: 'appointment', name: 'Appt Booked', color: '#F59E0B', count: 3 },
    { id: 'listed', name: 'Listed', color: '#10B981', count: 2 },
    { id: 'sold', name: 'Sold!', color: '#8B5CF6', count: 12 },
  ],
  total: 93
}
```

### 5. Get Leads by Stage
**GET** `/lead/pipeline/:stageId`

Get all leads in a specific pipeline stage.

```typescript
// GET /lead/pipeline/contacted
// Response
{
  stage: { id: 'contacted', name: 'Made Contact', color: '#10B981' },
  leads: [
    { _id: '...', streetAddress: '123 Main St', ... },
    // ...
  ]
}
```

---

## Service Methods

### In `user.service.ts`:

```typescript
async getPipelineSettings(userId: string): Promise<PipelineStageConfig[]> {
  const user = await this.userModel.findById(userId);
  
  // Return defaults if user hasn't customized
  if (!user.pipelineStages || user.pipelineStages.length === 0) {
    return DEFAULT_PIPELINE_STAGES;
  }
  
  return user.pipelineStages.sort((a, b) => a.order - b.order);
}

async updatePipelineSettings(
  userId: string,
  stages: PipelineStageConfig[],
): Promise<PipelineStageConfig[]> {
  // Validate stages
  if (!stages || stages.length === 0) {
    throw new BadRequestException('At least one stage is required');
  }
  
  // Ensure unique IDs
  const ids = stages.map(s => s.id);
  if (new Set(ids).size !== ids.length) {
    throw new BadRequestException('Stage IDs must be unique');
  }
  
  // Normalize order
  const normalized = stages
    .sort((a, b) => a.order - b.order)
    .map((s, i) => ({ ...s, order: i + 1 }));
  
  await this.userModel.findByIdAndUpdate(userId, {
    pipelineStages: normalized,
  });
  
  return normalized;
}
```

### In `lead.service.ts`:

```typescript
async updateLeadPipeline(
  userId: string,
  leadId: string,
  stageId: string,
  notes?: string,
): Promise<{ lead: MyLead; stage: PipelineStageConfig }> {
  // Get user's pipeline config to validate stageId
  const userStages = await this.userService.getPipelineSettings(userId);
  const stage = userStages.find(s => s.id === stageId);
  
  if (!stage) {
    throw new BadRequestException('Invalid pipeline stage');
  }

  const myLead = await this.myLeadModel.findOneAndUpdate(
    { lead: leadId, business: userId },
    {
      lead: leadId,
      business: userId,
      pipelineStageId: stageId,
      pipelineUpdatedAt: new Date(),
      ...(notes !== undefined && { notes }),
    },
    { upsert: true, new: true },
  ).populate('lead');

  return { lead: myLead, stage };
}

async getPipelineSummary(userId: string): Promise<{
  stages: Array<PipelineStageConfig & { count: number }>;
  total: number;
}> {
  // Get user's custom stages
  const userStages = await this.userService.getPipelineSettings(userId);
  
  // Count leads per stage
  const counts = await this.myLeadModel.aggregate([
    { $match: { business: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$pipelineStageId', count: { $sum: 1 } } },
  ]);
  
  const countMap = new Map(counts.map(c => [c._id, c.count]));
  
  const stages = userStages.map(stage => ({
    ...stage,
    count: countMap.get(stage.id) || 0,
  }));
  
  const total = stages.reduce((sum, s) => sum + s.count, 0);
  
  return { stages, total };
}

async getLeadsByStage(userId: string, stageId: string) {
  const userStages = await this.userService.getPipelineSettings(userId);
  const stage = userStages.find(s => s.id === stageId);
  
  if (!stage) {
    throw new BadRequestException('Invalid pipeline stage');
  }
  
  const leads = await this.myLeadModel
    .find({ business: userId, pipelineStageId: stageId })
    .populate('lead')
    .sort({ pipelineUpdatedAt: -1 });
  
  return { stage, leads };
}
```

---

## Frontend Integration

```typescript
// Get user's pipeline configuration
const { stages } = await apiRequest('/user/pipeline-settings', 'GET');
// Returns user's custom stages with their names/colors

// Update pipeline settings (from settings page)
await apiRequest('/user/pipeline-settings', 'PUT', {
  stages: [
    { id: 'new', name: 'Fresh Lead', color: '#3B82F6', order: 1 },
    { id: 'contacted', name: 'Made Contact', color: '#10B981', order: 2 },
    // ...
  ]
});

// Move a lead to a stage
await apiRequest('/lead/{leadId}/pipeline', 'PATCH', {
  stageId: 'contacted',
  notes: 'Spoke with owner, interested'
});

// Get pipeline summary for dashboard
const { stages, total } = await apiRequest('/lead/pipeline/summary', 'GET');
// Returns: { stages: [{ id, name, color, count }...], total: 93 }
```

---

## Implementation Checklist

### User Model Changes
- [ ] Add `PipelineStageConfig` interface to `user.model.ts`
- [ ] Add `pipelineStages` array field to `UserSchema`
- [ ] Create `DEFAULT_PIPELINE_STAGES` constant

### MyLead Model Changes
- [ ] Add `pipelineStageId` field (String, nullable)
- [ ] Add `pipelineUpdatedAt` field (Date, nullable)
- [ ] Add `notes` field (String)

### User Service/Controller
- [ ] Add `getPipelineSettings(userId)` method
- [ ] Add `updatePipelineSettings(userId, stages)` method
- [ ] Add `GET /user/pipeline-settings` endpoint
- [ ] Add `PUT /user/pipeline-settings` endpoint

### Lead Service/Controller
- [ ] Add `updateLeadPipeline(userId, leadId, stageId, notes)` method
- [ ] Add `getPipelineSummary(userId)` method
- [ ] Add `getLeadsByStage(userId, stageId)` method
- [ ] Add `PATCH /lead/:leadId/pipeline` endpoint
- [ ] Add `GET /lead/pipeline/summary` endpoint
- [ ] Add `GET /lead/pipeline/:stageId` endpoint

### Testing
- [ ] Test creating default stages for new user
- [ ] Test customizing stage names/colors
- [ ] Test adding/removing stages
- [ ] Test moving leads between stages
- [ ] Test that deleting a stage doesn't orphan leads

---

## Estimated Effort

| Task | Time |
|------|------|
| User model changes | 20 mins |
| MyLead model changes | 10 mins |
| User service/controller (settings) | 45 mins |
| Lead service/controller (pipeline) | 45 mins |
| Testing | 45 mins |
| **Total** | **~2.5-3 hours** |

---

## Edge Cases to Handle

1. **User deletes a stage that has leads in it**: Either prevent deletion, or move those leads to a default "Uncategorized" stage

2. **Stage ID stability**: Use stable IDs (like `stage_1`, `stage_2` or slugs) rather than names, so renaming a stage doesn't break the lead associations

3. **Maximum stages**: Consider limiting to 10 stages max to prevent UI issues

4. **Stage reordering**: When user reorders stages, just update the `order` field - lead associations use `id` so they're unaffected
