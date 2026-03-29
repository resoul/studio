'use client';

import { hotkeysCoreFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { FileIcon, FolderIcon, FolderOpenIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tree, TreeItem, TreeItemLabel } from '@/components/ui/tree';

/**
 * `Tree`, `TreeItem`, `TreeItemLabel` komponentlari hamda `lucide-react` kutubxonasining ikonkalari
 * foydalanuvchi interfeysini yanada qulay va estetik qiladi.
 */

interface Item {
  name: string;
  children?: string[];
}

const items: Record<string, Item> = {
  crm: {
    name: 'CRM',
    children: ['leads', 'accounts', 'activities', 'support'],
  },
  leads: {
    name: 'Leads',
    children: ['projectplan', 'integration', 'test'],
  },
  projectplan: { name: 'ProjectPlan_v1.0.docx' },
  integration: { name: 'Integration_Guide.docx' },
  test: { name: 'Test_Cases_Suite.xlsx' },
  accounts: {
    name: 'Accounts',
    children: ['acme-corp', 'globex-inc'],
  },
  'acme-corp': {
    name: 'Acme Corp',
    children: ['acme-contacts', 'acme-opportunities'],
  },
  'acme-contacts': {
    name: 'Contacts',
    children: ['apy', 'meeting'],
  },
  apy: { name: 'API_Documentation_v2.0.pdf' },
  meeting: { name: 'Meeting_Minutes_2024_09_15.docx' },
  'acme-opportunities': {
    name: 'Opportunities',
    children: ['database', 'design'],
  },
  database: { name: 'Database_ERD_Diaqram.vsdx' },
  design: { name: 'Design_Specifications_v3.1.docx' },
  'globex-inc': {
    name: 'Globex Inc',
    children: ['globex-contacts', 'globex-opportunities'],
  },
  'globex-contacts': {
    name: 'Contacts',
    children: ['deployment'],
  },
  deployment: { name: 'Deployment_Checklist.xlsx' },
  'globex-opportunities': {
    name: 'Opportunities',
    children: ['release'],
  },
  release: { name: 'Release_Notes_2025_06_01.docx' },
  activities: {
    name: 'Activities',
    children: ['system', 'bug', 'training'],
  },
  system: { name: 'System_Architecture.vsdx' },
  bug: { name: 'Bug_Report_Summary.xlsx' },
  training: { name: 'Training_Materials_v1.2.pdf' },
  support: {
    name: 'Support',
    children: ['change', 'requirements'],
  },
  change: { name: 'Change_Log_2025_05_20.docx' },
  requirements: { name: 'Requirements_Backlog.xlsx' },
};

const indent = 20;

export function CompanyRecordsFiles() {
  const tree = useTree<Item>({
    initialState: {
      expandedItems: ['leads', 'accounts', 'activities'],
    },
    indent,
    rootItemId: 'crm',
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Files</h3>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>
      <Tree {...tree} className="flex flex-col">
        {tree.getItems().map((item) => (
          <TreeItem key={item.getId()} item={item}>
            <TreeItemLabel className="before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10">
              <span className="flex items-center gap-1">
                {item.isFolder() ? (
                  item.isExpanded() ? (
                    <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
                  ) : (
                    <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
                  )
                ) : (
                  <FileIcon className="text-muted-foreground pointer-events-none size-4" />
                )}
                {item.getItemName()}
              </span>
            </TreeItemLabel>
          </TreeItem>
        ))}
      </Tree>
    </div>
  );
}
