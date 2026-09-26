import Link from "next/link";
import BrandPageNav from "@/components/BrandPageNav";
import { getProductPhotoSrc, products } from "@/lib/products";

/**
 * Editorial /brand page.
 *
 * Brand copy lives in this file as real text (not imported from brand.js).
 * The product list still comes from lib/products.js.
 *
 * Section order:
 *   hero → statement → salon origin → observation archive →
 *   product principles → ritual → product family → transparency + closing
 */

/**
 * Photo slot. `ratio` keeps the frame when the image is missing.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {"landscape" | "portrait" | "square"} props.ratio
 * @param {string} [props.src]
 * @param {string} [props.alt]
 */
function BrandMedia({ label, ratio, src, alt }) {
  return (
    <figure className={`bp-media bp-media--${ratio}`}>
      {src ? (
        <img src={src} alt={alt || label} className="bp-media-photo" />
      ) : (
        <span className="bp-media-label">{label}</span>
      )}
    </figure>
  );
}

export default function BrandStory() {
  return (
    <main className="BrandPage">
      {/* Outside the hero so sticky lasts for the whole page.
          Scroll direction lives in BrandPageNav (client). */}
      <BrandPageNav
        links={[
          { label: "Brand", href: "#brand-statement" },
          { label: "Principles", href: "#principles" },
          { label: "Products", href: "#products" },
          { label: "Contact", href: "#contact" },
        ]}
      />

      {/* 1. Hero — lineup photo, then the title under the frame. */}
      <section className="bp-hero container" aria-label="브랜드 소개">
        <div className="bp-hero-frame">
          <img
            className="bp-hero-photo"
            src="/brand/lineup-hero.jpg"
            alt="앤클로이 모이스춰 로션, 헤어 미스트, 두피 샴푸, 버블 워시, EGF 앰플, 스칼프 팩, 페이스 팩 라인업"
          />
        </div>

        <div className="bp-hero-copy">
          <div>
            <p className="bp-hero-eyebrow">SALON BORN</p>
            <h1 className="bp-hero-title">
              살롱의 경험에서 시작한
              {"\n"}
              투명한 케어.
            </h1>
          </div>
          <div className="bp-hero-aside">
            <p className="bp-hero-desc">
              앤클로이는 살롱의 손길에서 시작된 뷰티 브랜드입니다.
              {"\n"}
              빼야 할 여섯 가지를 뺀 처방으로 순환을 지킵니다.
            </p>
            <a className="button" href="#principles">
              브랜드 원칙 보기
            </a>
          </div>
        </div>
      </section>

      {/* 2. Brand statement — one sentence, the longest-lasting message. */}
      <section
        id="brand-statement"
        className="bp-section"
        aria-labelledby="bp-statement-heading"
      >
        <div className="container">
          <div className="bp-statement-wrapper">
            <p className="bp-eyebrow">BRAND STATEMENT</p>
            <h2 id="bp-statement-heading" className="bp-statement">
              빼야 할 여섯 가지를 뺀 퍼펙트 천연. 침투가
              아니라 순환으로 헤어, 두피, 피부를 돌봅니다.
            </h2>
          </div>
        </div>
      </section>

      {/* 3. Salon origin — asymmetric 7:5 split. */}
      <section
        className="bp-section bp-section--parchment"
        aria-labelledby="bp-origin-heading"
      >
        <div className="bp-origin-grid container">
          <BrandMedia
            label="Salon Archive"
            ratio="landscape"
            src="/products/shampoo/lifestyle.jpg"
            alt="앤클로이 두피 샴푸"
          />
          <div>
            <p className="bp-eyebrow">SALON ORIGIN</p>
            <h2 id="bp-origin-heading" className="bp-section-heading">
              살롱에서 시작했습니다
            </h2>
            <p className="bp-copy">
              앤클로이는 살롱의 손길에서 시작된 뷰티 브랜드입니다. 매일 두피와
              모발을 만지는 자리에서, 제품이 남기고 가는 것들을 가장 가까이에서
              보아 왔습니다.
            </p>
            <p className="bp-copy">
              즉각적인 효과를 내세우는 과대 광고가 아니라, 민감하고 문제성
              피부를 가진 분들이 인정한 사용감과 입소문으로 천천히 성장해
              왔습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Observation archive — document list, thin dividers. */}
      <section className="bp-section" aria-labelledby="bp-observation-heading">
        <div className="container">
          <p className="bp-eyebrow">OBSERVATION ARCHIVE</p>
          <h2 id="bp-observation-heading" className="bp-section-heading">
            우리는 먼저 관찰했습니다.
          </h2>

          <ol className="bp-archive-list">
            <li className="bp-archive-item">
              <span className="bp-archive-index">01</span>
              <div>
                <h3 className="bp-archive-title">두피에 남는 무거움</h3>
                <p className="bp-archive-copy">
                  오일 베이스 처방은 모공을 막는 큰 원인 중 하나입니다. 씻어낸
                  뒤에도 남는 무거움을 먼저 기록했습니다.
                </p>
              </div>
            </li>
            <li className="bp-archive-item">
              <span className="bp-archive-index">02</span>
              <div>
                <h3 className="bp-archive-title">반복되는 자극</h3>
                <p className="bp-archive-copy">
                  방부제, 알코올, 합성 계면활성제는 피부 장벽과 상재균의 리듬을
                  흔들 수 있습니다. 자극이 반복되는 지점을 살폈습니다.
                </p>
              </div>
            </li>
            <li className="bp-archive-item">
              <span className="bp-archive-index">03</span>
              <div>
                <h3 className="bp-archive-title">복잡한 사용 단계</h3>
                <p className="bp-archive-copy">
                  단계를 더하는 케어보다, 원인을 빼는 케어가 먼저라고
                  판단했습니다. 그래서 처방에서 여섯 가지를 뺐습니다.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 5. Product principles — the trust section, styled as a record. */}
      <section
        id="principles"
        className="bp-section bp-section--parchment"
        aria-labelledby="bp-principles-heading"
      >
        <div className="container">
          <p className="bp-eyebrow">PRODUCT PRINCIPLES</p>
          <h2 id="bp-principles-heading" className="bp-section-heading">
            제품이 지키는 원칙
          </h2>
          <p className="bp-free-line">
            무오일 · 무방부제 · 무알코올 · 무합성계면활성제 · 무색소 · 무향료
          </p>

          <dl className="bp-principles-table">
            <div className="bp-principles-row">
              <dt>아미노산계 세정</dt>
              <dd>
                강한 알칼리성 합성 계면활성제 대신 아미노산계 세정 성분을
                사용합니다. 두피 보호막을 지키는 클린 세정이 기준입니다.
              </dd>
            </div>
            <div className="bp-principles-row">
              <dt>6無 지향</dt>
              <dd>
                무오일 · 무방부제 · 무알코올 · 무합성계면활성제 · 무색소 ·
                무향료. 여섯 가지를 빼는 것이 처방의 출발점입니다.
              </dd>
            </div>
            <div className="bp-principles-row">
              <dt>무방부제의 방식</dt>
              <dd>
                기초 제품은 소형 바이알에 담고 충진 후 멸균 처리합니다.
                합성이든 천연이든, 방부제에 기대지 않는 구조를 택했습니다.
              </dd>
            </div>
            <div className="bp-principles-row">
              <dt>성분과 사용법 공개</dt>
              <dd>
                전성분과 사용 방법을 각 제품 상세 페이지에 그대로 공개합니다.
                확인되지 않은 인증이나 수치는 싣지 않습니다.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 6. Ritual — portrait media + three large step numbers. */}
      <section className="bp-section" aria-labelledby="bp-ritual-heading">
        <div className="bp-ritual-grid container">
          <BrandMedia
            label="Ritual Image"
            ratio="portrait"
            src="/products/lotion/lifestyle.jpg"
            alt="앤클로이 스킨&바디 보습 로션"
          />
          <div>
            <p className="bp-eyebrow">RITUAL</p>
            <h2 id="bp-ritual-heading" className="bp-section-heading">
              사용의 리듬
            </h2>

            <ol className="bp-ritual-steps">
              <li className="bp-ritual-step">
                <div className="bp-ritual-step-body">
                  <span className="bp-ritual-number" aria-hidden="true">
                    01
                  </span>
                  <div>
                    <h3 className="bp-ritual-title">비우기</h3>
                    <p className="bp-ritual-copy">
                      아미노산계 세정으로 노폐물을 부드럽게 씻어냅니다.
                    </p>
                  </div>
                </div>
              </li>
              <li className="bp-ritual-step">
                <div className="bp-ritual-step-body">
                  <span className="bp-ritual-number" aria-hidden="true">
                    02
                  </span>
                  <div>
                    <h3 className="bp-ritual-title">채우기</h3>
                    <p className="bp-ritual-copy">
                      오일 없이 수분을 채워 결을 정돈합니다.
                    </p>
                  </div>
                </div>
              </li>
              <li className="bp-ritual-step">
                <div className="bp-ritual-step-body">
                  <span className="bp-ritual-number" aria-hidden="true">
                    03
                  </span>
                  <div>
                    <h3 className="bp-ritual-title">지키기</h3>
                    <p className="bp-ritual-copy">
                      식물 미네랄의 환원력으로 산화되는 두피와 피부를 돌봅니다.
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* 7. Product family — no prices, no badges, text link only. */}
      <section
        id="products"
        className="bp-section bp-section--parchment"
        aria-labelledby="bp-family-heading"
      >
        <div className="container">
          <p className="bp-eyebrow">PRODUCT FAMILY</p>
          <h2 id="bp-family-heading" className="bp-section-heading">
            제품군
          </h2>

          <ul className="bp-family-grid">
            {products.map((product) => (
              <li key={product.id} className="bp-family-item">
                <Link
                  href={`/products/${product.id}`}
                  className="bp-family-link"
                >
                  <BrandMedia
                    label={product.name}
                    ratio="square"
                    src={getProductPhotoSrc(product)}
                    alt=""
                  />
                  <h3 className="bp-family-name">{product.name}</h3>
                  <p className="bp-family-role">{product.description}</p>
                  <span className="bp-text-link">자세히 보기</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Transparency + closing. Only verifiable records. */}
      <section
        id="contact"
        className="bp-section"
        aria-labelledby="bp-transparency-heading"
      >
        <div className="container">
          <p className="bp-eyebrow">TRANSPARENCY</p>
          <h2 id="bp-transparency-heading" className="bp-section-heading">
            확인할 수 있는 것만 말합니다
          </h2>

          <dl className="bp-transparency-table">
            <div className="bp-principles-row">
              <dt>전성분</dt>
              <dd>
                각 제품 상세 페이지의 INFORMATION 표에서 전성분을 공개합니다.
              </dd>
            </div>
            <div className="bp-principles-row">
              <dt>사용 방법</dt>
              <dd>
                제품별 사용 단계와 주의 사항을 상세 페이지에 그대로 싣습니다.
              </dd>
            </div>
            <div className="bp-principles-row">
              <dt>제조 · 판매</dt>
              <dd>
                (주)앤클로이 토탈뷰티 · 경상북도 포항시 남구 대이로 45 (이수빌딩
                9층)
              </dd>
            </div>
          </dl>

          <div className="bp-closing">
            <p className="bp-closing-sentence">
              성분과 사용법을 직접 확인해 보세요.
            </p>
            <Link href="/#collection" className="bp-pill bp-pill--ink">
              컬렉션 보기
            </Link>

            <p className="bp-company-line">
              (주)앤클로이 토탈뷰티 · 경상북도 포항시 남구 대이로 45 (이수빌딩
              9층) · <a href="tel:0542413336">054.241.3336</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
