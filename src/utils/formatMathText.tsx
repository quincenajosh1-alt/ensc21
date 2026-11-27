import { Fragment, type ReactNode } from 'react';

/**
 * Converts mathematical underscore notation like `r_in`, `T_env`, `c_crit`, `y_h`, `δ_st`
 * into clean HTML `<sub>` subscript elements across prose and equations.
 */
export function formatMathText(text: string): ReactNode {
  if (!text.includes('_')) return text;

  const parts = text.split(/([A-Za-z0-9α-ωΑ-Ωδζθω]+_[A-Za-z0-9]+)/g);
  return parts.map((part, index) => {
    const match = /^([A-Za-z0-9α-ωΑ-Ωδζθω]+)_([A-Za-z0-9]+)$/.exec(part);
    if (match) {
      return (
        <Fragment key={index}>
          {match[1]}
          <sub className="text-[0.75em] leading-none align-sub">{match[2]}</sub>
        </Fragment>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}
