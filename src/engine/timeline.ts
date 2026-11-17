
import type { Event, Frame } from '../types';
export function buildTimeline<S>(initial:S, events:Event[], reduce:(state:S,event:Event)=>S):Frame<S>[] {
  const frames:Frame<S>[]=[{state:structuredClone(initial),event:{type:'INIT',label:'Initial state'},index:0}];
  let state=structuredClone(initial);
  for (const event of events) { state=reduce(state,event); frames.push({state:structuredClone(state),event,index:frames.length}); }
  return frames;
}
export function frameAt<S>(frames:Frame<S>[],index:number):Frame<S> { if(!frames.length) throw new Error('Timeline is empty'); return frames[Math.max(0,Math.min(index,frames.length-1))]; }
