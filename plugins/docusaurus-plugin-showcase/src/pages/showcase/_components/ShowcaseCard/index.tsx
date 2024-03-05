/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import FavoriteIcon from '../../../../components/svgIcons/FavoriteIcon';
import {
    type Article,
} from '../../../../data/articles';
import {
    type TagType,
    type Tag,
    TagList,
    Tags
} from '../../../../data/Tags';
import {sortBy} from '../../../../utils/jsUtils';
import Tooltip from '../ShowcaseTooltip';
import styles from './styles.module.css';
import * as url from "url";

const TagComp = React.forwardRef<HTMLLIElement, Tag>(
    ({label, color, description}, ref) => (
        <li ref={ref} className={styles.tag} title={description}>
            <span className={styles.textLabel}>{label.toLowerCase()}</span>
            <span className={styles.colorLabel} style={{backgroundColor: color}} />
        </li>
    ),
);

function ShowcaseCardTag({tags}: {tags: TagType[]}) {
    const tagObjects = tags.map((tag) => ({tag, ...Tags[tag]}));

    // Keep same order for all tags
    const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
        TagList.indexOf(tagObject.tag),
    );

    return (
        <>
            {tagObjectsSorted.map((tagObject, index) => {
                const id = `showcase_card_tag_${tagObject.tag}`;

                return (
                    <Tooltip
                        key={index}
                        text={tagObject.description}
                        anchorEl="#__docusaurus"
                        id={id}>
                        <TagComp key={index} {...tagObject} />
                    </Tooltip>
                );
            })}
        </>
    );
}

function getCardImage(article: Article): string {
    return (
        article.preview ?? 'https://raw.githubusercontent.com/getstarjar/open-saas/main/static/img/placeholder.png'
    );
  }

function ShowcaseCard({article}: {article: Article}) {
    const image = getCardImage(article);

    let sourceElement = <></>;

    if (article.source) {
        const sourceURL = new URL(article.source);

        if (sourceURL.host.endsWith('github.com')) {
            sourceElement = (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <img src={`https://img.shields.io/github/stars${sourceURL.pathname}`} alt={article.title} style={{ width: "100%", objectFit: "cover" }} />
                </div>
            )
        } else {
            sourceElement = (
                <Link
                    href={article.source}
                    className={clsx(
                        'button button--secondary button--sm',
                        styles.showcaseCardSrcBtn,
                    )}>
                    <Translate id="showcase.card.sourceLink">source</Translate>
                </Link>
            );
        }
    }

    return (
        <li key={article.title} className={`card ${styles.cardBoxShadow}`}>
            <div className={clsx('card__image', styles.showcaseCardImage)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={image} alt={article.title} style={{ width: "100%", objectFit: "cover" }} />
            </div>
            <div className="card__body">
                <div className={clsx(styles.showcaseCardHeader)}>
                    <h4 className={styles.showcaseCardTitle}>
                        <Link href={article.website} className={styles.showcaseCardLink}>
                            {article.title}
                        </Link>
                    </h4>
                    {article.tags.includes('favorite') && (
                        <FavoriteIcon svgClass={styles.svgIconFavorite} size="small" />
                    )}
                    {sourceElement}
                </div>
                <p className={styles.showcaseCardBody}>{article.description}</p>
            </div>
            <ul className={clsx('card__footer', styles.cardFooter)}>
                <ShowcaseCardTag tags={article.tags} />
            </ul>
        </li>
    );
}

export default React.memo(ShowcaseCard);