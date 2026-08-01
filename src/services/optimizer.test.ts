import { expect,it } from 'vitest'
import { makeDemoData } from '../data/demo'
import { createBaseline } from '../lib/defaults'
import { aggregate,allocateStarters } from './scoring'
import { optimize } from './optimizer'
it('optimizer is reproducible',()=>{const c=createBaseline(),r=allocateStarters(aggregate(makeDemoData(),c),c);expect(optimize(c,r,25,7).best).toEqual(optimize(c,r,25,7).best)})
