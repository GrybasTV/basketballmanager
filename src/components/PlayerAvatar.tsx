import React from 'react';
import Image from 'next/image';

interface PlayerAvatarProps {
  playerId: string;
  position: string;
  ovr: number;
  size?: number;
  showOvr?: boolean;
  className?: string;
}

export function PlayerAvatar({
  playerId,
  position,
  ovr,
  size = 80,
  showOvr = true,
  className = '',
}: PlayerAvatarProps) {
  // Use the avatar API route
  const avatarUrl = `/api/players/${playerId}/avatar`;

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        className="rounded-full overflow-hidden border-2 border-slate-600 bg-slate-800"
        style={{ width: size, height: size }}
      >
        <img
          src={avatarUrl}
          alt={`Player ${position}`}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      </div>

      {showOvr && (
        <div
          className="absolute -bottom-1 -right-1 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center font-bold text-white"
          style={{
            width: size * 0.3,
            height: size * 0.3,
            fontSize: size * 0.12,
            minWidth: 20,
            minHeight: 20,
          }}
        >
          {ovr}
        </div>
      )}

      {/* Position badge */}
      <div
        className="absolute -top-1 -left-1 rounded-full flex items-center justify-center text-white font-bold text-xs"
        style={{
          backgroundColor: getPositionColor(position),
          width: size * 0.25,
          height: size * 0.25,
          minWidth: 16,
          minHeight: 16,
          fontSize: size * 0.1,
        }}
      >
        {position}
      </div>
    </div>
  );
}

function getPositionColor(position: string): string {
  const colors: Record<string, string> = {
    PG: '#3B82F6',   // blue
    SG: '#10B981',   // green
    SF: '#F59E0B',   // yellow
    PF: '#EF4444',   // red
    C: '#8B5CF6',    // purple
  };
  return colors[position] || '#6B7280';
}

// Card version with player info
interface PlayerAvatarCardProps {
  playerId: string;
  position: string;
  ovr: number;
  firstName: string;
  lastName: string;
  age: number;
  pot?: number;
}

export function PlayerAvatarCard({
  playerId,
  position,
  ovr,
  firstName,
  lastName,
  age,
  pot,
}: PlayerAvatarCardProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition">
      <div className="flex items-center gap-4">
        <PlayerAvatar
          playerId={playerId}
          position={position}
          ovr={ovr}
          size={64}
        />

        <div className="flex-1">
          <h4 className="font-semibold text-white">
            {firstName} {lastName}
          </h4>
          <div className="flex items-center gap-3 mt-1 text-sm">
            <span className="text-slate-400">{age} m.</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPositionBadgeClass(position)}`}>
              {position}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div>
              <span className="text-2xl font-bold text-blue-400">{ovr}</span>
              <span className="text-xs text-slate-500 ml-1">OVR</span>
            </div>
            {pot && pot > ovr && (
              <div>
                <span className="text-lg font-semibold text-green-400">{pot}</span>
                <span className="text-xs text-slate-500 ml-1">POT</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getPositionBadgeClass(position: string): string {
  const classes: Record<string, string> = {
    PG: 'bg-blue-500/20 text-blue-400',
    SG: 'bg-green-500/20 text-green-400',
    SF: 'bg-yellow-500/20 text-yellow-400',
    PF: 'bg-red-500/20 text-red-400',
    C: 'bg-purple-500/20 text-purple-400',
  };
  return classes[position] || 'bg-slate-500/20 text-slate-400';
}
