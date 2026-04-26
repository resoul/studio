import type { ReactNode } from 'react';
import { StoreClientProvider } from '@/pages/account/components/context';
import { StoreClientWrapper } from '@/pages/account/components/wrapper';

export function ModulesProvider({ children }: { children: ReactNode }) {
    return (
        <StoreClientProvider>
            <StoreClientWrapper>{children}</StoreClientWrapper>
        </StoreClientProvider>
    );
}