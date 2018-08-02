import tree from './meddra.json';
import { formatOneNodeForAntd } from './utils';

export const treeDataForAntd = Object.entries(tree).map(formatOneNodeForAntd);