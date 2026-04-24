import { selectProgressGallery, selectProgressMilestones, selectProgressMonths, selectProgressPhases } from './selectors';

export const ganttMonths = selectProgressMonths();

export const ganttPhases = selectProgressPhases();

export const ganttMilestones = selectProgressMilestones();

export const ganttGallery = selectProgressGallery();
