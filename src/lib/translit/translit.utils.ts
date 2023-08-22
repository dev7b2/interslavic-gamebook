/**
 * Copied from
 * https://github.com/medzuslovjansky/js-utils/blob/main/src/transliterate/transliterate.ts
 */

/* tslint:disable */

/**
 * @param iSource
 * @param type to Latin = 1
 * @param flav etymolog = 2
 * @see {@link http://steen.free.fr/scripts/transliteration.js}
 */
export function transliterate(
  iSource: string,
  type: number = 1,
  flav: string | number = 2,
): string {
  return iSource
    .normalize("NFC")
    .replace(/[\p{Letter}\p{Mark}]+/gu, (w) => transliterateWord(w, type, flav));
}

const VOWEL = /[aeiouyąęųåėȯèòěê]/;

function transliterateWord(iW: string, type: string | number, flav: string | number) {
  //symbol % marks the borders of the %word%
  iW = "%" + iW + "%";
  let OrigW = iW;
  iW = nmsify(iW.toLowerCase());
  // 'ŕ' remains between two consonants, in other cases is replaced by 'ř'
  iW = iW.replace(/ŕ/g, "ř");
  const aPos = iW.indexOf("ř");
  if (
    aPos > 1 &&
    iW.charAt(aPos - 1) != "%" &&
    VOWEL.test(iW.charAt(aPos - 1)) == false &&
    VOWEL.test(iW.charAt(aPos + 1)) == false
  ) {
    iW = iW.substring(0, aPos) + "ŕ" + iW.substring(aPos + 1, iW.length);
  }

  // 'r' is replaced by 'ŕ' or 'ṙ' between two consonants except 'j': 'ŕ' after [šžčc], 'ṙ' in other cases
  iW = iW.replace(/rj/g, "Rj");
  iW = iW.replace(/jr/g, "jR");
  const rPos = iW.indexOf("r");
  if (
    rPos > 1 &&
    iW.charAt(rPos - 1) != "%" &&
    VOWEL.test(iW.charAt(rPos - 1)) == false &&
    VOWEL.test(iW.charAt(rPos + 1)) == false
  ) {
    iW = iW.substring(0, rPos) + "ṙ" + iW.substring(rPos + 1, iW.length);
    // iW = iW.replace (/’ṙ/, "ṙ");
    // iW = iW.replace (/jṙ/, "ŕ");
    iW = iW.replace(/([šžčc])ṙ/g, "$1ŕ");
  }
  iW = iW.replace(/R/g, "r");
  // 'x' is replaced by 'ks'
  iW = iW.replace(/x/g, "ks");
  // inserting auxiliary symbol 'ı' after soft consonants
  iW = iW.replace(/([ńľřťďśź])j/g, "$1ıj");
  // interting delimiter # in some cases
  iW = iW.replace(/([dsz])j/g, "$1#j");
  iW = iW.replace(/%obj/g, "ob#j");
  iW = iW.replace(/%neobj/g, "neob#j");
  iW = iW.replace(/%vj/g, "v#j");

  /* FLAVORIZACIJE */

  // 2 - ethymological, 3 - standard, 4 - slovianto
  if (flav == "2" || flav == "3" || flav == "4") {
    iW = iW.replace(/ê/g, "ě");
    iW = iW.replace(/ȯ%/g, "o%");
    iW = iW.replace(/ŭ/g, "v");
    iW = iW.replace(/[ṱḓ]/g, "");
    iW = iW.replace(/[’`]/g, "#%");
    iW = iW.replace(/([čšžj])ě/g, "$1e");
  }

  /* PISMA I PRAVOPISY */

  /* Latin alphabet */
  if (type == 1) {
    //ethymological
    if (flav == "2") {
      iW = iW.replace(/ṙ/g, "r");
      iW = iW.replace(/ř/g, "ŕ");
      iW = iW.replace(/ľ/g, "ĺ");
      iW = iW.replace(/ť/g, "t́");
      iW = iW.replace(/ď/g, "d́");
      iW = iW.replace(/([čšžj])ŕ/g, "$1r");
    }
  }

  iW = iW.replace(/jj/g, "j");
  iW = iW.replace(/[#ı%]/g, "");
  OrigW = OrigW.replace(/%/g, "");

  /** Restore the original case (lower, upperFirst, upper) **/
  const iW_first = iW.charAt(0);
  const iW_rest = iW.substring(1);

  if (OrigW.charAt(0) == OrigW.charAt(0).toLowerCase()) {
    iW = iW.toLowerCase();
  } else if (OrigW.length > 1 && OrigW.charAt(1) == OrigW.charAt(1).toLowerCase()) {
    iW = iW_first.toUpperCase() + iW_rest.toLowerCase();
  } else {
    iW = iW.toUpperCase();
  }

  return iW;
}

function nmsify(iW: string) {
  return (
    iW
      .replace(/[яꙗ]/g, "#a")
      .replace(/ьа/g, "#a")
      .replace(/ѥ/g, "#e")
      .replace(/ье/g, "#e")
      .replace(/ї/g, "#i")
      .replace(/ьи/g, "#i")
      .replace(/ё/g, "#o")
      .replace(/ьо/g, "#o")
      .replace(/ю/g, "#u")
      .replace(/ьу/g, "#u")
      .replace(/ѩ/g, "#ę")
      .replace(/ьѧ/g, "#ę")
      .replace(/ѭ/g, "#ų")
      .replace(/ьѫ/g, "#ų")
      .replace(/нь/g, "ń")
      .replace(/н#/g, "nj")
      .replace(/њ/g, "nj")
      .replace(/ль/g, "ĺ")
      .replace(/л#/g, "lj")
      .replace(/љ/g, "lj")
      .replace(/рь/g, "ŕ")
      .replace(/р#/g, "ŕ")
      .replace(/ть/g, "ť")
      .replace(/т#/g, "ť")
      .replace(/дь/g, "ď")
      .replace(/д#/g, "ď")
      .replace(/сь/g, "ś")
      .replace(/с#/g, "ś")
      .replace(/зь/g, "ź")
      .replace(/з#/g, "ź")
      .replace(/ь%/g, "%")
      .replace(/[ђѓ]/g, "đ")
      .replace(/[ћќ]/g, "ć")
      .replace(/ѕ/g, "dz")
      .replace(/џ/g, "dž")
      .replace(/а/g, "a")
      .replace(/б/g, "b")
      .replace(/в/g, "v")
      .replace(/[гґ]/g, "g")
      .replace(/д/g, "d")
      .replace(/[еэ]/g, "e")
      .replace(/[єѣ]/g, "ě")
      .replace(/ж/g, "ž")
      .replace(/[зꙁꙀ]/g, "z")
      .replace(/[иіѵѷ]/g, "i")
      .replace(/[йјь#]/g, "j")
      .replace(/к/g, "k")
      .replace(/л/g, "l")
      .replace(/м/g, "m")
      .replace(/н/g, "n")
      .replace(/[оѡ]/g, "o")
      .replace(/п/g, "p")
      .replace(/р/g, "r")
      .replace(/с/g, "s")
      .replace(/[тѳ]/g, "t")
      .replace(/[уȣѹ]/g, "u")
      .replace(/ф/g, "f")
      .replace(/х/g, "h")
      .replace(/ц/g, "c")
      .replace(/ч/g, "č")
      .replace(/ш/g, "š")
      .replace(/щ/g, "šč")
      .replace(/[ыꙑ]/g, "y")
      .replace(/ъ/g, "ȯ") // Fixed by Denis Šabalin
      .replace(/ў/g, "ŭ")
      .replace(/ѧ/g, "ę")
      .replace(/ѫ/g, "ų")
      .replace(/ѱ/g, "ps")
      .replace(/ѯ/g, "ks")
      .replace(/ӑ/g, "å") // Added by Denis Šabalin
      // ...
      .replace(/⁙/g, ".")
      // ...
      .replace(/zsk/g, "z#sk")
      .replace(/zst/g, "z#st")
      .replace(/%izs/g, "%iz#s")
      .replace(/%bezs/g, "%bez#s")
      .replace(/%razs/g, "%raz#s")
      .replace(/%råzs/g, "%råz#s")
      .replace(/konjug/g, "kon#jug")
      .replace(/konjun/g, "kon#jun")
      .replace(/injek/g, "in#jek")
      // ...
      .replace(/s[xz]/g, "š")
      .replace(/c[xz]/g, "č")
      .replace(/z[xs]/g, "ž")
      .replace(/ż/g, "ž")
      .replace(/ye/g, "ě")
      // ...
      .replace(/qu/g, "kv")
      .replace(/ŀ/g, "ȯl")
      .replace(/[ăq`]/g, "’")
      .replace(/ch/g, "h")
      .replace(/w/g, "v")
      .replace(/x/g, "ks")
      // ...
      .replace(/[áàâā]/g, "a")
      .replace(/[íìîīĭı]/g, "i")
      .replace(/[úûůū]/g, "u")
      .replace(/[ąǫũ]/g, "ų")
      .replace(/ù/g, "ŭ")
      .replace(/[éē]/g, "e")
      .replace(/[ĕëè]/g, "ė")
      .replace(/[œóô]/g, "o")
      .replace(/[ŏöò]/g, "ȯ")
      .replace(/ý/g, "y")
      .replace(/ł/g, "l")
      .replace(/ç/g, "c")
      .replace(/ʒ/g, "z")
      .replace(/ĵ/g, "j")
      .replace(/[ĺļǉ]/g, "ľ")
      .replace(/[ňñņǌ]/g, "ń")
      .replace(/ř/g, "ŕ")
      .replace(/t́/g, "ť")
      .replace(/d́/g, "ď")
      // ...
      .replace(/([jćđšžč])y/g, "$1i")
      .replace(/jj/g, "j")
  );
}
