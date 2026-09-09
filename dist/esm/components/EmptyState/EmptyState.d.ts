import React from 'react';
export interface EmptyStateProps {
    message: string;
    icon?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}
export declare const EmptyState: React.FC<EmptyStateProps>;
export default EmptyState;
//# sourceMappingURL=EmptyState.d.ts.map