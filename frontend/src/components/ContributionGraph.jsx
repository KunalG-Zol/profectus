import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
import './ContributionGraph.css';

const ContributionGraph = ({ contributions }) => {
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - 1);

    return (
        <div>
            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={contributions}
                classForValue={(value) => {
                    if (!value) {
                        return 'color-empty';
                    }
                    return `color-scale-${Math.min(value.count, 4)}`;
                }}
                tooltipDataAttrs={value => {
                    return {
                        'data-tip': `${value.date}: ${value.count} contributions`,
                    };
                }}
            />
            <ReactTooltip />
        </div>
    );
};

export default ContributionGraph;
