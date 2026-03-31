'use client';

import { ActivitiesInterview } from './interview';
import { ActivitiesProductWebinar } from './product-webinar';
import { ActivitiesPhotographyWorkshop } from './photography-workshop';
import { ActivitiesNewArticle } from './new-article';
import { ActivitiesUpcomingContent } from './upcoming-content';
import { ActivitiesProjectStatus } from './project-status';

export function ActivityPage() {
  return (
    <div className="space-y-4">
      <ActivitiesNewArticle />
      <ActivitiesInterview />
      <ActivitiesPhotographyWorkshop />
      <ActivitiesUpcomingContent />
      <ActivitiesProductWebinar />
      <ActivitiesProjectStatus />
    </div>
  );
}
