import React from 'react';
import { DashboardSummaryType } from './index';
import svgIcons from '../../../services/svgService';

interface DashboardSummaryProps {
  loadingSummary: boolean;
  errorSummary: string | null;
  cards: DashboardSummaryType[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ loadingSummary, errorSummary, cards }) => {
  if (loadingSummary) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        Loading...
      </div>
    );
  }

  if (errorSummary) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p className="text-red-600">{errorSummary}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 flex-wrap">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex flex-col justify-between h-[148px] flex-1 bg-white rounded shadow transition-transform duration-300 hover:scale-105 hover:shadow-lg p-2 md:p-6"
        >
          <p className="text-sm text-gray-900">{card.title}</p>
          <h3 className="text-3xl text-gray-900">{card.count}k</h3>
          <div className="flex items-center gap-1">
            <div dangerouslySetInnerHTML={{ __html: card.percentage < 0 ? svgIcons.arrow_down : svgIcons.arrow_up }} />
            <p className="text-sm text-gray-900">{Math.abs(card.percentage)}%</p>
            <p className="text-xs text-gray-600">previous month</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;
