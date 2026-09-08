/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';

describe('Ln4Ui-patternWebp', () => {
    let ln4Ui-patternWebp: Ln4Ui-patternWebp;

beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [], // Add
        controllers: [], // Add
        providers: [],   // Add
    }).compile();

    ln4Ui-patternWebp = moduleRef.get<Ln4Ui-patternWebp>(Ln4Ui-patternWebp);
    });

it('should be defined', () => {
    expect(ln4Ui-patternWebp).toBeDefined();
    });
});
