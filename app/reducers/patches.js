import R from 'ramda';
import undoable from 'redux-undo';
import { patchReducer } from './patch';
import applyReducers from '../utils/applyReducers';
import {
  getPatchUndoType,
  getPatchRedoType,
  getPatchClearHistoryType,
  PATCH_ADD,
  PATCH_DELETE,
} from '../actionTypes';

export const patches = (patchIds) => {
  const undoFilter = (action) => !(R.pathEq(['meta', 'skipHistory'], true, action));

  const reducers = R.pipe(
    R.values,
    R.reduce((p, id) => {
      const undoConfig = {
        filter: undoFilter,
        undoType: getPatchUndoType(id),
        redoType: getPatchRedoType(id),
        clearHistoryType: getPatchClearHistoryType(id),
      };
      return R.assoc(id, undoable(patchReducer(id), undoConfig), p);
    }, {})
  )(patchIds);

  const newPatch = (id, name, folderId) => ({
    past: [],
    present: {
      id,
      name: name || 'New patch',
      folderId: folderId || null,
      nodes: {},
      pins: {},
      links: {},
    },
    future: [],
  });

  return (state = {}, action) => {
    switch (action.type) {
      case PATCH_ADD:
        return R.assoc(
          action.payload.newId,
          newPatch(
            action.payload.newId,
            action.payload.name
          ),
          state
        );
      case PATCH_DELETE:
        return R.omit([action.payload.id.toString()], state);
      default:
        return applyReducers(reducers, state, action);
    }
  };
};
