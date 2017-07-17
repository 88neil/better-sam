import { describe, it } from 'mocha'
import { assert } from 'chai'
import Parser from '../../src/parser/parser.es6';
import Renderer from '../../src/renderer/renderer.es6';
import RendererC from '../../src/renderer/c-conv/renderer.es6';

process.env.NODE_ENV = 'karma-test';

function assertUint8ArraySame(actual, expected, message) {
  for (let i = 0;i<expected.length+1;i++) {
    assert.equal(actual[i], expected[i], `${message} at ${i}`);
  }

  assert.deepEqual([].slice.call(actual), [].slice.call(expected), message);
}

describe('renderer vs renderer-c', () => {
  [
    'SAH5KSEHSFUHL',
    'PREHNTIHS',
    'AENIHZAAGAEMAXS',
    '/HEHLOW, MAY NEYM IHZ SAEM.',
    'IHZ KAORREHKT, PLEY5 AXGEH4N? AOR DUW YUW PRIY4FER PAONX?',
    'JAH5ST TEHSTIHNX',
    'WAH4N ZIY4ROW POYNT FAY4V PERSEH4NT',
    'WAH4N  TUW4  THRIY4  FOH4R  FAY4V  SIH4KS  ZIY4ROW POYNT FAY4V, AY4 KAEN KAWNT.',
    'KAHMPYUWTER',
    '/HEHLOW',
    'WIHZAA5RD',
    'MEHDDUL',
    'AESTRUNAHMIY',
    'FAH5NKSHUN',
    'AXWEY5',
    'EY4T',
    'TRAEK',
    'DRAY',
    'AA5RT',
    'AOL',
    'KOW',
    'SPAY',
    'STAY',
    'SKAY',
    'SKOWL',
    'NUW',
    'DUW',
    'SUW',
    'ZUW5',
    'THUW5',
    'TUW5',
    'CHYUW',
    'JEY5',
    'PAA5RTIY',
    'TAA5RDIY',
    'MEHDDUL AESTRUNAHMIY FAH5NKSHUN AXWEY5 EY4T TRAEK DRAY AA5RT AOL KOW SPAY STAY SKAY SKOWL NUW DUW SUW ZUW5 THUW5 TUW5 CHYUW JEY5 PAA5RTIY TAA5RDIY',
    'KEY4S FAWND AH PLEYS AET DHAX BAA5R. BEHTWIY4N DHIY AHNLIHKLIY TAEN AAN WAHN AHV LAHNIYZUNEHS /HUWRZ.'
  ].forEach((test) => {
    it(`should render ${test}`, () => {
      const parsed = Parser(test);
      RendererC(parsed.phonemeindex, parsed.phonemeLength, parsed.stress);
      Renderer(parsed.phonemeindex, parsed.phonemeLength, parsed.stress);

      assert.notEqual(
        RendererC(parsed.phonemeindex, parsed.phonemeLength, parsed.stress),
        false,
        'RendererC did not succeed'
      );
      assert.notEqual(
        Renderer(parsed.phonemeindex, parsed.phonemeLength, parsed.stress),
        false,
        'Renderer did not succeed'
      );

      const output = Renderer.karmaOutput;
      const outputC = RendererC.karmaOutput;

      assertUint8ArraySame(output.freq1data, outputC.freq1data, "freq1data mismatch");
      assertUint8ArraySame(output.freq2data, outputC.freq2data, "freq2data mismatch");
      assertUint8ArraySame(output.freq3data, outputC.freq3data, "freq3data mismatch");

      assertUint8ArraySame(output.pitches, outputC.pitches, "pitches mismatch");
      assertUint8ArraySame(output.sampledConsonantFlag,outputC.sampledConsonantFlag, "sampledConsonantFlag mismatch");
      assertUint8ArraySame(output.frequency1, outputC.frequency1, "frequency1 mismatch");
      assertUint8ArraySame(output.frequency2, outputC.frequency2, "frequency2 mismatch");
      assertUint8ArraySame(output.frequency3, outputC.frequency3, "frequency3 mismatch");
      assertUint8ArraySame(output.amplitude1, outputC.amplitude1, "amplitude1 mismatch");
      assertUint8ArraySame(output.amplitude2, outputC.amplitude2, "amplitude2 mismatch");
      assertUint8ArraySame(output.amplitude3, outputC.amplitude3, "amplitude3 mismatch");
    });
  });
});
