import React from 'react';
import { Check, Clock, Sparkles } from 'lucide-react';

export interface StepperStage {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ApplicationProgressStepperProps {
  currentStage: number;
  stages: StepperStage[];
  maxCompletedStage?: number;
  onStageClick?: (stageId: number) => void;
  isSubmitted?: boolean;
}

export const ApplicationProgressStepper: React.FC<ApplicationProgressStepperProps> = ({
  currentStage,
  stages,
  maxCompletedStage = 1,
  onStageClick,
  isSubmitted = false,
}) => {
  const totalStages = stages.length;
  const stagesLeft = isSubmitted ? 0 : Math.max(0, totalStages - currentStage);
  const progressPercent = isSubmitted
    ? 100
    : Math.round(((currentStage - 0.5) / totalStages) * 100);

  return (
    <div
      id="application-progress-stepper-container"
      className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3.5"
    >
      {/* Top Status Row: Stage count & Remaining stages indicator */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            id="badge-stepper-stage-counter"
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-900 text-white tracking-wide"
          >
            {isSubmitted ? 'Completed' : `Stage ${currentStage} of ${totalStages}`}
          </span>
          <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
            {stages[currentStage - 1]?.title || 'Application Submission'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isSubmitted ? (
            <span
              id="badge-stepper-remaining"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300"
            >
              <Sparkles className="w-3 h-3 text-emerald-700" />
              <span>All 4 Stages Completed</span>
            </span>
          ) : (
            <span
              id="badge-stepper-remaining"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300"
            >
              <Clock className="w-3 h-3 text-amber-700" />
              <span>
                {stagesLeft === 1
                  ? '1 stage left (Final Review)'
                  : `${stagesLeft} stages left`}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Visual Stepper Nodes & Connector Track */}
      <div className="relative">
        <ol className="flex items-center justify-between w-full relative z-10">
          {stages.map((stage, idx) => {
            const isCompleted = isSubmitted || stage.id < currentStage;
            const isCurrent = !isSubmitted && stage.id === currentStage;
            const isClickable =
              !isSubmitted &&
              stage.id <= Math.max(maxCompletedStage, currentStage) &&
              stage.id !== currentStage &&
              onStageClick !== undefined;

            const IconComponent = stage.icon;

            return (
              <li
                key={stage.id}
                className="flex-1 flex flex-col items-center relative text-center group"
              >
                {/* Connecting Track Line behind nodes */}
                {idx !== 0 && (
                  <div
                    className="absolute top-4 sm:top-4.5 -left-1/2 w-full h-0.5 -z-10 transition-colors duration-300"
                    style={{
                      backgroundColor:
                        isSubmitted || stage.id <= currentStage
                          ? '#047857' // emerald-700
                          : '#e2e8f0', // slate-200
                    }}
                  />
                )}

                {/* Stepper Node Button / Circle */}
                <button
                  type="button"
                  id={`btn-stepper-node-${stage.id}`}
                  disabled={!isClickable}
                  onClick={() => isClickable && onStageClick(stage.id)}
                  title={
                    isClickable
                      ? `Go back to ${stage.title}`
                      : `${stage.title}: Stage ${stage.id}`
                  }
                  className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  } ${
                    isCompleted
                      ? 'bg-emerald-800 text-white shadow-xs hover:bg-emerald-900'
                      : isCurrent
                      ? 'bg-white border-2 border-emerald-800 text-emerald-800 ring-4 ring-emerald-100 font-bold shadow-xs'
                      : 'bg-slate-100 border border-slate-300 text-slate-400 font-semibold'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  ) : (
                    <IconComponent className="w-4 h-4" />
                  )}

                  {/* Active stage pulsing dot */}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-700" />
                    </span>
                  )}
                </button>

                {/* Stage Labels */}
                <div className="mt-1.5 flex flex-col items-center">
                  <span
                    className={`text-[11px] sm:text-xs leading-tight transition-colors whitespace-nowrap ${
                      isCurrent
                        ? 'font-bold text-emerald-950'
                        : isCompleted
                        ? 'font-semibold text-slate-800'
                        : 'text-slate-400 font-medium'
                    }`}
                  >
                    <span className="hidden sm:inline">{stage.title}</span>
                    <span className="sm:hidden">{stage.shortTitle}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 hidden md:inline leading-tight mt-0.5">
                    {stage.description}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Micro Progress Bar Line */}
      <div className="w-full bg-slate-200 h-1 rounded-full mt-3 overflow-hidden">
        <div
          id="stepper-progress-fill"
          className="bg-emerald-700 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
