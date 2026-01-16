'use client';

import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  ArrowRight,
  Edit,
  Star,
  Building2,
  User,
  ChevronLeft,
} from 'lucide-react';
import { Lead, Property, Opportunity, Activity, User as UserType } from '@/types';
import { cn } from '@/lib/utils/cn';
import { formatPhoneDisplay } from '@/lib/utils/phone';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface LeadProfileProps {
  lead: Lead;
  property?: Property;
  opportunity?: Opportunity;
  activities: Activity[];
  assignedAgent?: Pick<UserType, 'id' | 'first_name' | 'last_name' | 'phone' | 'avatar_url'>;
  onLogCall?: () => void;
  onSendSMS?: () => void;
  onSendEmail?: () => void;
  onAddNote?: () => void;
  onSendAppraisal?: () => void;
  onBookAppointment?: () => void;
  onMoveStage?: (stageId: string) => void;
}

export function LeadProfile({
  lead,
  property,
  opportunity,
  activities,
  assignedAgent,
  onLogCall,
  onSendSMS,
  onSendEmail,
  onAddNote,
  onSendAppraisal,
  onBookAppointment,
  onMoveStage,
}: LeadProfileProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/leads"
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                {lead.first_name} {lead.last_name}
              </h1>
              <p className="text-sm text-slate-500">
                Lead • Added {lead.created_at && formatDistanceToNow(lead.created_at.toDate(), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {lead.is_exclusive && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                Exclusive
              </span>
            )}
            <button className="btn btn-secondary btn-sm flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Lead Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-slate-600">
                    {lead.first_name?.[0]}{lead.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {lead.first_name} {lead.last_name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Source: {lead.source === 'facebook' ? 'Facebook Ads' : 
                             lead.source === 'app' ? 'App' : 
                             lead.source === 'import' ? 'Import' : 'Manual'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a href={`tel:${lead.phone}`} className="text-brand-600 hover:underline">
                    {formatPhoneDisplay(lead.phone)}
                  </a>
                </div>
                
                {lead.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a href={`mailto:${lead.email}`} className="text-brand-600 hover:underline">
                      {lead.email}
                    </a>
                  </div>
                )}

                {lead.property_address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{lead.property_address}</span>
                  </div>
                )}
              </div>

              {/* Stage */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Current Stage
                </label>
                <div className="mt-2">
                  <select 
                    className="input"
                    value={opportunity?.stage_id || 'lead'}
                    onChange={(e) => onMoveStage?.(e.target.value)}
                  >
                    <option value="lead">Lead</option>
                    <option value="qualified">Qualified Lead</option>
                    <option value="contact">Contact Made</option>
                    <option value="appointment">Appointment</option>
                    <option value="listing">Listing</option>
                    <option value="sale">Sale</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              {/* Assigned Agent */}
              {assignedAgent && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Assigned To
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-sm text-slate-900">
                      {assignedAgent.first_name} {assignedAgent.last_name}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-medium text-slate-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-semibold text-slate-900">{lead.follow_up_count || 0}</p>
                  <p className="text-sm text-slate-500">Follow-ups</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">
                    {lead.appraisal_sent ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-slate-500">Appraisal Sent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Property + Timeline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Property Card */}
            {property ? (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{property.address}</h3>
                      <p className="text-sm text-slate-500">
                        {property.suburb}, {property.state} {property.postcode}
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    'score-badge text-lg px-3 py-1',
                    property.seller_score >= 80 ? 'score-hot' : 
                    property.seller_score >= 60 ? 'score-warm' : 
                    property.seller_score >= 40 ? 'score-cool' : 'score-cold'
                  )}>
                    {property.seller_score}%
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  {property.bedrooms && <span>{property.bedrooms} bed</span>}
                  {property.bathrooms && <span>{property.bathrooms} bath</span>}
                  {property.land_size_sqm && <span>{property.land_size_sqm}m²</span>}
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/properties/${property.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    View Property
                  </Link>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={onSendAppraisal}
                  >
                    Send Appraisal
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 border-dashed p-8 text-center">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">No property linked</p>
                <p className="text-sm text-slate-500 mb-4">Link a property to see seller insights</p>
                <button className="btn btn-secondary btn-sm">
                  Link Property
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-medium text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button 
                  className="btn btn-secondary btn-md flex items-center justify-center gap-2"
                  onClick={onLogCall}
                >
                  <Phone className="w-4 h-4" />
                  Log Call
                </button>
                <button 
                  className="btn btn-secondary btn-md flex items-center justify-center gap-2"
                  onClick={onSendSMS}
                >
                  <MessageSquare className="w-4 h-4" />
                  Send SMS
                </button>
                <button 
                  className="btn btn-secondary btn-md flex items-center justify-center gap-2"
                  onClick={onSendEmail}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button 
                  className="btn btn-secondary btn-md flex items-center justify-center gap-2"
                  onClick={onAddNote}
                >
                  <FileText className="w-4 h-4" />
                  Add Note
                </button>
                <button 
                  className="btn btn-secondary btn-md flex items-center justify-center gap-2"
                  onClick={onBookAppointment}
                >
                  <Calendar className="w-4 h-4" />
                  Book Appt
                </button>
                <button 
                  className="btn btn-primary btn-md flex items-center justify-center gap-2"
                  onClick={onSendAppraisal}
                >
                  <FileText className="w-4 h-4" />
                  Send Appraisal
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-medium text-slate-900 mb-4">Timeline</h3>
              
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No activity yet</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {activities.map((activity) => (
                    <TimelineItem key={activity.id} activity={activity} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ activity }: { activity: Activity }) {
  const iconMap: Record<string, { icon: typeof Phone; color: string; bg: string }> = {
    call: { icon: Phone, color: 'text-green-600', bg: 'bg-green-100' },
    sms: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
    email: { icon: Mail, color: 'text-purple-600', bg: 'bg-purple-100' },
    note: { icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' },
    stage_change: { icon: ArrowRight, color: 'text-amber-600', bg: 'bg-amber-100' },
    appraisal_sent: { icon: FileText, color: 'text-brand-600', bg: 'bg-brand-100' },
    appointment: { icon: Calendar, color: 'text-pink-600', bg: 'bg-pink-100' },
    system: { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-50' },
  };

  const config = iconMap[activity.type] || iconMap.system;
  const Icon = config.icon;

  return (
    <div className="timeline-item">
      <div className={cn('timeline-dot', config.bg)}>
        <Icon className={cn('w-3 h-3', config.color)} />
      </div>
      <div>
        <p className="text-sm text-slate-900">{activity.content}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {activity.created_at && formatDistanceToNow(activity.created_at.toDate(), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
