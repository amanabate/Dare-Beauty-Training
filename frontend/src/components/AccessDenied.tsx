'use client';

import React from 'react';
import { ShieldAlert, Lock, ShieldCheck, ArrowRight, UserCheck, X, LogIn } from 'lucide-react';
import { UserAccount } from '../types';

export interface AccessDeniedProps {
  currentUser: UserAccount | null;
  allowedRoles?: string[];
  featureName?: string;
  onClose?: () => void;
  onOpenSignIn?: () => void;
  onOpenInstructorDashboard?: () => void;
  onOpenStudentDashboard?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  currentUser,
  allowedRoles = ['Admin'],
  featureName = 'Enterprise Admin Dashboard & Management Features',
  onClose,
  onOpenSignIn,
  onOpenInstructorDashboard,
  onOpenStudentDashboard
}) => {
  const isUnauthenticated = !currentUser;
  const userRole = currentUser?.role || 'Guest';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#161619] border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Access Denied Badge & Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-mono text-xs font-bold uppercase tracking-wider border border-red-500/30">
            Access Denied • Role Protection Active
          </span>
          <h2 className="text-2xl font-serif font-bold text-white pt-2">
            Unauthorized Access
          </h2>
          <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
            You do not have permission to view <strong className="text-[#E9C349]">{featureName}</strong>. 
            Access is strictly restricted to accounts with <span className="text-white font-mono font-bold">{allowedRoles.join(', ')}</span> privileges.
          </p>
        </div>

        {/* Current Identity Details Box */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-mono text-[10px] uppercase">Active User Identity:</span>
            <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${
              currentUser?.role === 'Admin'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : currentUser?.role === 'Instructor'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : currentUser?.role === 'Student'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-gray-800 text-gray-400 border-gray-700'
            }`}>
              {userRole} Role
            </span>
          </div>

          <div className="text-xs font-semibold text-white">
            {isUnauthenticated ? (
              <span className="text-gray-400 italic">No user signed in (Unauthenticated session)</span>
            ) : (
              <span>{currentUser.name} ({currentUser.email})</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isUnauthenticated ? (
            onOpenSignIn && (
              <button
                onClick={() => {
                  onClose?.();
                  onOpenSignIn();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:bg-[#F5D468] shadow-lg flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In as Admin</span>
              </button>
            )
          ) : userRole === 'Instructor' ? (
            onOpenInstructorDashboard && (
              <button
                onClick={() => {
                  onClose?.();
                  onOpenInstructorDashboard();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:bg-[#F5D468] shadow-lg flex items-center justify-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Switch to Instructor Portal</span>
              </button>
            )
          ) : userRole === 'Student' || userRole === 'Applicant' ? (
            onOpenStudentDashboard && (
              <button
                onClick={() => {
                  onClose?.();
                  onOpenStudentDashboard();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:bg-[#F5D468] shadow-lg flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Student Portal</span>
              </button>
            )
          ) : null}

          {onClose && (
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20 border border-white/10 transition-colors"
            >
              Close Alert
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// HOC for Role Protection
export function withRoleProtection<P extends { isOpen?: boolean; currentUser: UserAccount | null; onClose?: () => void; onOpenSignIn?: () => void; onOpenInstructorDashboard?: () => void; onOpenStudentDashboard?: () => void }>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[] = ['Admin'],
  featureName: string = 'Enterprise Admin Dashboard'
): React.FC<P> {
  const ProtectedComponent: React.FC<P> = (props: P) => {
    if (props.isOpen === false) {
      return null;
    }

    const hasAccess = props.currentUser && allowedRoles.includes(props.currentUser.role);

    if (!hasAccess && props.isOpen) {
      return (
        <AccessDenied
          currentUser={props.currentUser}
          allowedRoles={allowedRoles}
          featureName={featureName}
          onClose={props.onClose}
          onOpenSignIn={props.onOpenSignIn}
          onOpenInstructorDashboard={props.onOpenInstructorDashboard}
          onOpenStudentDashboard={props.onOpenStudentDashboard}
        />
      );
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedComponent;
}

// Layout Wrapper Component for Role Protection
export const RoleGuard: React.FC<{
  currentUser: UserAccount | null;
  allowedRoles?: string[];
  featureName?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenSignIn?: () => void;
  onOpenInstructorDashboard?: () => void;
  onOpenStudentDashboard?: () => void;
  children: React.ReactNode;
}> = ({
  currentUser,
  allowedRoles = ['Admin'],
  featureName = 'Protected Feature',
  isOpen = true,
  onClose,
  onOpenSignIn,
  onOpenInstructorDashboard,
  onOpenStudentDashboard,
  children
}) => {
  if (!isOpen) return null;

  const hasAccess = currentUser && allowedRoles.includes(currentUser.role);

  if (!hasAccess) {
    return (
      <AccessDenied
        currentUser={currentUser}
        allowedRoles={allowedRoles}
        featureName={featureName}
        onClose={onClose}
        onOpenSignIn={onOpenSignIn}
        onOpenInstructorDashboard={onOpenInstructorDashboard}
        onOpenStudentDashboard={onOpenStudentDashboard}
      />
    );
  }

  return <>{children}</>;
};
