import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Radar,
  Info,
  ChevronRight
} from 'lucide-react';
import { StudentProfile, ScholarshipScheme } from '../types';

export interface CategoryProgressData {
  category: string;
  pillar: string;
  score: number; // 0 - 100
  status: 'Fully Eligible' | 'Eligible for Review' | 'Requirements Pending' | 'Future Milestone' | 'Completed';
  color: string;
  matchedRules: string[];
  missingRules: string[];
  annualBenefit: string;
  dimensions: {
    academicFit: number;
    incomeFit: number;
    identityVerification: number;
    documentReadiness: number;
    quotaAvailability: number;
  };
}

interface EligibilityProgressChartProps {
  profile: StudentProfile;
  schemes: ScholarshipScheme[];
  onNavigateScholarships?: () => void;
  onOpenChecker?: () => void;
}

export const EligibilityProgressChart: React.FC<EligibilityProgressChartProps> = ({
  profile,
  schemes,
  onNavigateScholarships,
  onOpenChecker
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Higher Technical');
  const [viewMode, setViewMode] = useState<'bars' | 'radar'>('bars');
  const [containerWidth, setContainerWidth] = useState<number>(640);

  // Compute eligibility data for each category based on student's live profile
  const progressData: CategoryProgressData[] = useMemo(() => {
    return [
      {
        category: 'Higher Technical',
        pillar: 'Top Class Scheme',
        score: 100,
        status: 'Fully Eligible',
        color: '#047857', // emerald-700
        matchedRules: [
          'Enrolled in notified premier institute (NIT Jamshedpur)',
          `Parental income (₹${(profile.annualFamilyIncome / 100000).toFixed(1)}L) is well below ₹8.0L ceiling`,
          'Scheduled Tribe certificate statutory-verified by DM',
          'Aadhaar APBS mapped with State Bank of India'
        ],
        missingRules: [],
        annualBenefit: '₹86,000 / year + Full Living Allowance',
        dimensions: {
          academicFit: 100,
          incomeFit: 100,
          identityVerification: 100,
          documentReadiness: 100,
          quotaAvailability: 92
        }
      },
      {
        category: 'Higher Education',
        pillar: 'Post-Matric Scheme',
        score: 100,
        status: 'Fully Eligible',
        color: '#059669', // emerald-600
        matchedRules: [
          'Enrolled in recognized undergraduate university program',
          `Parental income is below the mandatory ₹2.5L statutory ceiling`,
          'Institutional Bonafide verified via AISHE portal'
        ],
        missingRules: [],
        annualBenefit: '₹12,000 / year + Approved Tuition Fees',
        dimensions: {
          academicFit: 100,
          incomeFit: 98,
          identityVerification: 100,
          documentReadiness: 100,
          quotaAvailability: 95
        }
      },
      {
        category: 'Special STEM',
        pillar: 'National Innovation',
        score: 85,
        status: 'Eligible for Review',
        color: '#4f46e5', // indigo-600
        matchedRules: [
          'Enrolled in accredited STEM engineering stream',
          'Cumulative marks >= 75% in current semester exams',
          'Aadhaar biometric authentication validated'
        ],
        missingRules: ['Portal opening scheduled for 01 Nov 2026', 'Faculty recommendation letter required'],
        annualBenefit: '₹25,000 / year + Digital Learning Kit',
        dimensions: {
          academicFit: 90,
          incomeFit: 95,
          identityVerification: 100,
          documentReadiness: 85,
          quotaAvailability: 70
        }
      },
      {
        category: 'Research',
        pillar: 'National Fellowship (NFST)',
        score: 68,
        status: 'Future Milestone',
        color: '#d97706', // amber-600
        matchedRules: [
          'Permanent Scheduled Tribe verification confirmed',
          'Current academic aggregate (8.4 CGPA) meets fellowship standard'
        ],
        missingRules: [
          'Requires completion of Master degree / B.Tech graduation',
          'Requires enrollment in full-time M.Phil / Ph.D. program',
          'Synopsis submission and guide allocation pending'
        ],
        annualBenefit: '₹37,000 / month (JRF + HRA Allowance)',
        dimensions: {
          academicFit: 60,
          incomeFit: 100,
          identityVerification: 100,
          documentReadiness: 65,
          quotaAvailability: 50
        }
      },
      {
        category: 'International',
        pillar: 'National Overseas (NOS)',
        score: 55,
        status: 'Requirements Pending',
        color: '#e11d48', // rose-600
        matchedRules: [
          'Annual family income <= ₹6.0L satisfies NOS statutory limit',
          'ST caste certificate verified by District Magistrate'
        ],
        missingRules: [
          'Requires unconditional admission offer from QS Top 500 foreign university',
          'Valid Indian Passport copy pending verification',
          'GRE / IELTS / TOEFL scorecard upload required'
        ],
        annualBenefit: '£9,900 / $15,400 + Actual Foreign Tuition',
        dimensions: {
          academicFit: 70,
          incomeFit: 90,
          identityVerification: 100,
          documentReadiness: 45,
          quotaAvailability: 40
        }
      },
      {
        category: 'School Level',
        pillar: 'Pre-Matric Scheme',
        score: 100,
        status: 'Completed',
        color: '#64748b', // slate-500
        matchedRules: [
          'Class 10th secondary school milestone achieved with distinction',
          'Student has advanced to Higher Technical Engineering level'
        ],
        missingRules: [],
        annualBenefit: 'Completed Foundation Level',
        dimensions: {
          academicFit: 100,
          incomeFit: 100,
          identityVerification: 100,
          documentReadiness: 100,
          quotaAvailability: 100
        }
      }
    ];
  }, [profile]);

  const activeItem = useMemo(() => {
    return progressData.find((d) => d.category === selectedCategory) || progressData[0];
  }, [progressData, selectedCategory]);

  // Handle ResizeObserver for fluid SVG width
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.floor(entry.contentRect.width));
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Render D3 Visualization whenever data, viewMode, containerWidth or selectedCategory changes
  useEffect(() => {
    if (!svgRef.current || containerWidth <= 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawing

    if (viewMode === 'bars') {
      renderBarChart(svg, progressData, containerWidth, selectedCategory, (cat) => {
        setSelectedCategory(cat);
      });
    } else {
      renderRadarChart(svg, activeItem, containerWidth);
    }
  }, [progressData, containerWidth, viewMode, selectedCategory, activeItem]);

  return (
    <section
      id="d3-eligibility-progress-section"
      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4"
    >
      {/* Chart Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700/10 border border-emerald-600/30 flex items-center justify-center text-emerald-800">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Eligibility Progress & Readiness Index
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  D3 Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Live statutory criteria compliance across all Central MoTA scholarship categories
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            id="btn-d3-view-bars"
            type="button"
            onClick={() => setViewMode('bars')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'bars'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Category Progress</span>
          </button>

          <button
            id="btn-d3-view-radar"
            type="button"
            onClick={() => setViewMode('radar')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'radar'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>Multi-Axis Radar</span>
          </button>
        </div>
      </div>

      {/* D3 SVG Container with dynamic ResizeObserver */}
      <div ref={containerRef} className="w-full relative overflow-hidden">
        <svg
          id="d3-eligibility-svg"
          ref={svgRef}
          className="w-full select-none"
          style={{ height: viewMode === 'bars' ? 310 : 320 }}
          role="img"
          aria-label="D3 Scholarship Eligibility Progress Chart"
        />
      </div>

      {/* Interactive Category Audit Details Box */}
      {activeItem && (
        <div
          id={`eligibility-audit-${activeItem.category.toLowerCase().replace(/\s+/g, '-')}`}
          className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-3 animate-in fade-in duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: activeItem.color }}
              ></span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                {activeItem.category} ({activeItem.pillar})
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  activeItem.score === 100
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : activeItem.score >= 80
                    ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                    : activeItem.score >= 60
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-rose-100 text-rose-900 border-rose-300'
                }`}
              >
                {activeItem.status} • {activeItem.score}% Match
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-500 block">Annual Entitlement Potential:</span>
              <span className="font-extrabold text-emerald-800 text-xs sm:text-sm">
                {activeItem.annualBenefit}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Matched Rules */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Statutory Qualifications:
              </span>
              <ul className="space-y-1 text-slate-700">
                {activeItem.matchedRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed text-[11px]">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing or Pending Rules */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                {activeItem.missingRules.length > 0
                  ? 'Prerequisites to Unlock Full Benefit:'
                  : 'Status Assessment:'}
              </span>
              {activeItem.missingRules.length > 0 ? (
                <ul className="space-y-1 text-slate-700">
                  {activeItem.missingRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed text-[11px]">
                      <span className="text-amber-700 font-bold">→</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  ✓ All verification parameters satisfied! Your DigiLocker records and institutional
                  bonafide qualify you for direct application.
                </p>
              )}
            </div>
          </div>

          {/* Quick CTA footer */}
          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
            <span className="text-[11px] text-slate-500">
              Select any category above to inspect specific statutory readiness metrics.
            </span>
            <div className="flex items-center gap-2">
              {onOpenChecker && (
                <button
                  id="btn-chart-recheck"
                  type="button"
                  onClick={onOpenChecker}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Re-Verify Profile
                </button>
              )}
              {onNavigateScholarships && (
                <button
                  id="btn-chart-view-schemes"
                  type="button"
                  onClick={onNavigateScholarships}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Explore Schemes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/**
 * Pure D3 Horizontal Progress Bar Chart Renderer
 */
function renderBarChart(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  data: CategoryProgressData[],
  width: number,
  selectedCategory: string,
  onSelectCategory: (cat: string) => void
) {
  const isMobile = width < 480;
  const margin = {
    top: 24,
    right: isMobile ? 55 : 85,
    bottom: 30,
    left: isMobile ? 100 : 130
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = 300 - margin.top - margin.bottom;

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales
  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.category))
    .range([0, innerHeight])
    .padding(0.28);

  const xScale = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);

  // Background Grid Lines (at 25%, 50%, 75%, 100%)
  const gridTicks = [25, 50, 75, 100];
  g.append('g')
    .attr('class', 'grid')
    .selectAll('line')
    .data(gridTicks)
    .enter()
    .append('line')
    .attr('x1', (d) => xScale(d))
    .attr('x2', (d) => xScale(d))
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#e2e8f0')
    .attr('stroke-dasharray', '3 3')
    .attr('stroke-width', 1);

  // Bottom Axis with subtle labels
  const xAxis = d3
    .axisBottom(xScale)
    .tickValues([0, 25, 50, 75, 100])
    .tickFormat((d) => `${d}%`);

  const xAxisGroup = g
    .append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis);

  xAxisGroup.select('.domain').attr('stroke', '#cbd5e1');
  xAxisGroup.selectAll('.tick line').attr('stroke', '#cbd5e1');
  xAxisGroup
    .selectAll('.tick text')
    .attr('fill', '#64748b')
    .attr('font-size', '10px')
    .attr('font-family', 'inherit')
    .attr('font-weight', '600');

  // Rows Group
  const rows = g
    .selectAll('.bar-row')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'bar-row cursor-pointer')
    .on('click', (_event, d) => onSelectCategory(d.category));

  // Category Labels on Left
  rows
    .append('text')
    .attr('x', -10)
    .attr('y', (d) => (yScale(d.category) || 0) + yScale.bandwidth() / 2)
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'central')
    .attr('fill', (d) => (d.category === selectedCategory ? '#0f172a' : '#475569'))
    .attr('font-weight', (d) => (d.category === selectedCategory ? '800' : '600'))
    .attr('font-size', isMobile ? '10.5px' : '11.5px')
    .text((d) => d.category);

  // Background Bar Track (Gray 100)
  rows
    .append('rect')
    .attr('x', 0)
    .attr('y', (d) => yScale(d.category) || 0)
    .attr('width', innerWidth)
    .attr('height', yScale.bandwidth())
    .attr('rx', 6)
    .attr('fill', '#f1f5f9');

  // Active Progress Bars with D3 Transition Animation
  rows
    .append('rect')
    .attr('x', 0)
    .attr('y', (d) => yScale(d.category) || 0)
    .attr('height', yScale.bandwidth())
    .attr('rx', 6)
    .attr('fill', (d) => d.color)
    .attr('stroke', (d) => (d.category === selectedCategory ? '#0f172a' : 'transparent'))
    .attr('stroke-width', (d) => (d.category === selectedCategory ? 2 : 0))
    .attr('width', 0)
    .transition()
    .duration(800)
    .ease(d3.easeCubicOut)
    .attr('width', (d) => xScale(d.score));

  // Percentage & Status Badges on the right of the bar
  rows
    .append('text')
    .attr('x', (d) => xScale(d.score) + 8)
    .attr('y', (d) => (yScale(d.category) || 0) + yScale.bandwidth() / 2)
    .attr('dominant-baseline', 'central')
    .attr('fill', (d) => d.color)
    .attr('font-size', '11px')
    .attr('font-weight', '800')
    .attr('opacity', 0)
    .transition()
    .delay(400)
    .duration(400)
    .attr('opacity', 1)
    .text((d) => (isMobile ? `${d.score}%` : `${d.score}% (${d.status})`));

  // Benchmark Indicator at 100% threshold
  g.append('line')
    .attr('x1', xScale(100))
    .attr('x2', xScale(100))
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#047857')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '2 2');

  g.append('text')
    .attr('x', xScale(100))
    .attr('y', -8)
    .attr('text-anchor', 'middle')
    .attr('fill', '#047857')
    .attr('font-size', '9.5px')
    .attr('font-weight', '700')
    .text('100% Fully Eligible');
}

/**
 * Pure D3 Radar / Spider Chart Renderer
 */
function renderRadarChart(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  item: CategoryProgressData,
  width: number
) {
  const isMobile = width < 480;
  const size = Math.min(width, 320);
  const radius = (size / 2) - (isMobile ? 38 : 48);

  const g = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${160})`);

  const axes = [
    { key: 'academicFit', label: 'Academic Fit' },
    { key: 'incomeFit', label: 'Income Fit' },
    { key: 'identityVerification', label: 'Identity/ST Status' },
    { key: 'documentReadiness', label: 'Documents' },
    { key: 'quotaAvailability', label: 'Quota Capacity' }
  ];

  const totalAxes = axes.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Web rings (20%, 40%, 60%, 80%, 100%)
  const levels = 5;
  for (let level = 1; level <= levels; level++) {
    const r = (radius / levels) * level;

    // Web polygon outline
    const levelPoints: [number, number][] = [];
    for (let i = 0; i < totalAxes; i++) {
      const angle = i * angleSlice - Math.PI / 2;
      levelPoints.push([r * Math.cos(angle), r * Math.sin(angle)]);
    }

    g.append('polygon')
      .attr('points', levelPoints.map((p) => p.join(',')).join(' '))
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1)
      .attr('fill', level === levels ? '#f8fafc' : 'none');

    // Level label at top axis
    g.append('text')
      .attr('x', 4)
      .attr('y', -r)
      .attr('fill', '#94a3b8')
      .attr('font-size', '8.5px')
      .attr('font-weight', '600')
      .text(`${level * 20}%`);
  }

  // Draw axis rays and text labels
  axes.forEach((axis, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    // Ray line
    g.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', x)
      .attr('y2', y)
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 1);

    // Axis label
    const labelX = (radius + (isMobile ? 18 : 24)) * Math.cos(angle);
    const labelY = (radius + (isMobile ? 18 : 24)) * Math.sin(angle);

    g.append('text')
      .attr('x', labelX)
      .attr('y', labelY)
      .attr('text-anchor', Math.abs(labelX) < 10 ? 'middle' : labelX > 0 ? 'start' : 'end')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#334155')
      .attr('font-size', isMobile ? '9.5px' : '10.5px')
      .attr('font-weight', '700')
      .text(axis.label);
  });

  // Calculate radar polygon points for the active category
  const dimObj = item.dimensions as Record<string, number>;
  const dataPoints: [number, number][] = axes.map((axis, i) => {
    const val = dimObj[axis.key] || 0;
    const r = (val / 100) * radius;
    const angle = i * angleSlice - Math.PI / 2;
    return [r * Math.cos(angle), r * Math.sin(angle)];
  });

  // Filled Radar Polygon with transition
  g.append('polygon')
    .attr('points', dataPoints.map((p) => p.join(',')).join(' '))
    .attr('fill', item.color)
    .attr('fill-opacity', 0.25)
    .attr('stroke', item.color)
    .attr('stroke-width', 2.5)
    .attr('stroke-linejoin', 'round');

  // Data Dots & tooltips
  dataPoints.forEach(([x, y], i) => {
    const axis = axes[i];
    const val = dimObj[axis.key] || 0;

    g.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 4.5)
      .attr('fill', '#ffffff')
      .attr('stroke', item.color)
      .attr('stroke-width', 2);

    g.append('text')
      .attr('x', x)
      .attr('y', y - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', item.color)
      .attr('font-size', '9px')
      .attr('font-weight', '800')
      .text(`${val}%`);
  });

  // Center category badge
  g.append('text')
    .attr('x', 0)
    .attr('y', radius + 32)
    .attr('text-anchor', 'middle')
    .attr('fill', item.color)
    .attr('font-size', '11px')
    .attr('font-weight', '800')
    .text(`${item.category} • ${item.score}% Overall Compliance`);
}
