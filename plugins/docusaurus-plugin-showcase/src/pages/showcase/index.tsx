/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useMemo, useEffect} from 'react';
import clsx from 'clsx';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Translate, {translate} from '@docusaurus/Translate';
import {useHistory, useLocation} from '@docusaurus/router';
import {usePluralForm} from '@docusaurus/theme-common';

import Layout from '@theme/Layout';
import FavoriteIcon from '../../components/svgIcons/FavoriteIcon';
import {
  sortedArticles,
  type Article,
} from '../../data/articles';
import { 
  type TagType,
  TagList, 
  Tags
} from '../../data/Tags';
import ShowcaseTagSelect, {
  readSearchTags,
} from './_components/ShowcaseTagSelect';
import ShowcaseFilterToggle, {
  type Operator,
  readOperator,
} from './_components/ShowcaseFilterToggle';
import ShowcaseCard from './_components/ShowcaseCard';
import ShowcaseTooltip from './_components/ShowcaseTooltip';

import styles from './styles.module.css';

const TITLE = translate({message: 'SignalWire Guide Showcase'});
const DESCRIPTION = translate({
  message: "This is SignalWire's list of guides for all products and all languages.",
});

type ArticleState = {
  scrollTopPosition: number;
  focusedElementId: string | undefined;
};

function restoreArticleState(articleState: ArticleState | null) {
  const {scrollTopPosition, focusedElementId} = articleState ?? {
    scrollTopPosition: 0,
    focusedElementId: undefined,
  };
  // @ts-expect-error: if focusedElementId is undefined it returns null
  document.getElementById(focusedElementId)?.focus();
  window.scrollTo({top: scrollTopPosition});
}

export function prepareArticleState(): ArticleState | undefined {
  if (ExecutionEnvironment.canUseDOM) {
    return {
      scrollTopPosition: window.scrollY,
      focusedElementId: document.activeElement?.id,
    };
  }

  return undefined;
}

const SearchNameQueryKey = 'name';

function readSearchName(search: string) {
  return new URLSearchParams(search).get(SearchNameQueryKey);
}

function filterArticles(
    articles: Article[],
    selectedTags: TagType[],
    operator: Operator,
    searchName: string | null,
) {
  if (searchName) {
    // eslint-disable-next-line no-param-reassign
    articles = articles.filter((article) => 
        article.title.toLowerCase().includes(searchName.toLowerCase()) ||
        article.description.toLowerCase().includes(searchName.toLowerCase()),
    );
  }
  if (selectedTags.length === 0) {
    return articles;
  }
  return articles.filter((article) => {
    if (article.tags.length === 0) {
      return false;
    }
    if (operator === 'AND') {
      return selectedTags.every((tag) => article.tags.includes(tag));
    }
    return selectedTags.some((tag) => article.tags.includes(tag));
  });
}

function useFilteredArticles() {
  const location = useLocation<ArticleState>();
  const [operator, setOperator] = useState<Operator>('OR');
  // On SSR / first mount (hydration) no tag is selected
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [searchName, setSearchName] = useState<string | null>(null);
  // Sync tags from QS to state (delayed on purpose to avoid SSR/Client
  // hydration mismatch)
  useEffect(() => {
    setSelectedTags(readSearchTags(location.search));
    setOperator(readOperator(location.search));
    setSearchName(readSearchName(location.search));
    restoreArticleState(location.state);
  }, [location]);

  return useMemo(
      () => filterArticles(sortedArticles, selectedTags, operator, searchName),
      [selectedTags, operator, searchName],
  );
}

function ShowcaseHeader() {
  return (
      <section className="margin-top--lg margin-bottom--lg text--center">
        <h1>{TITLE}</h1>
        <p>{DESCRIPTION}</p>
        {/*<a*/}
        {/*    className="button button--primary"*/}
        {/*    href={EDIT_URL}*/}
        {/*    target="_blank"*/}
        {/*    rel="noreferrer">*/}
        {/*  <Translate id="showcase.header.button">*/}
        {/*    🙏 Please add your site*/}
        {/*  </Translate>*/}
        {/*</a>*/}
      </section>
  );
}

function useSiteCountPlural() {
  const {selectMessage} = usePluralForm();
  return (sitesCount: number) =>
      selectMessage(
          sitesCount,
          translate(
              {
                id: 'showcase.filters.resultCount',
                description:
                    'Pluralized label for the number of sites found on the showcase. Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
                message: '1 guide|{sitesCount} guides',
              },
              {sitesCount},
          ),
      );
}

function ShowcaseFilters() {
  const filteredArticles = useFilteredArticles();
  const siteCountPlural = useSiteCountPlural();
    let FilteredTagList;
    return (
        <section className="container margin-top--l margin-bottom--lg">
            <div className={clsx('margin-bottom--sm', styles.filterCheckbox)}>
                <div>
                    <h2>
                        <Translate id="showcase.filters.title">SignalWire Guide Showcase</Translate>
                    </h2>
                    <span>{siteCountPlural(filteredArticles.length)}</span>
                </div>
                <ShowcaseFilterToggle/>
            </div>
            <h4 style={{marginBottom: 'auto'}}>
                <Translate id="showcase.filters.title">Product</Translate>
            </h4>
            <ul className={clsx('clean-list', styles.checkboxList)}>

                {
                    TagList.filter(tag => tag.includes('prod')).map((tag, i) => {
                        const {label, description, color, reference, link} = Tags[tag];
                        const id = `showcase_checkbox_id_${tag}`;

                        return (
                            <li key={i} className={styles.checkboxListItem}>
                                <ShowcaseTooltip
                                    id={id}
                                    text={description}
                                    anchorEl="#__docusaurus">
                                    <ShowcaseTagSelect
                                        tag={tag}
                                        id={id}
                                        label={label}
                                        reference={reference}
                                        link={link}
                                        icon={
                                            tag === 'favorite' ? (
                                                <FavoriteIcon svgClass={styles.svgIconFavoriteXs}/>
                                            ) : (
                                                <span
                                                    style={{
                                                        backgroundColor: color,
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: '50%',
                                                        marginLeft: 8,
                                                    }}
                                                />
                                            )
                                        }
                                    />
                                </ShowcaseTooltip>
                            </li>
                        );
                    })}
            </ul>
            <h4 style={{marginBottom: 'auto'}}>
                <Translate id="showcase.filters.title">SDK</Translate>
            </h4>
            <ul className={clsx('clean-list', styles.checkboxList)}>
                {TagList.filter(tag => tag.includes('sdk')).map((tag, i) => {
                    const {label, description, color, reference, link} = Tags[tag];
                    const id = `showcase_checkbox_id_${tag}`;

                    return (
                        <li key={i} className={styles.checkboxListItem}>
                            <ShowcaseTooltip
                                id={id}
                                text={description}
                                anchorEl="#__docusaurus">
                                <ShowcaseTagSelect
                                    tag={tag}
                                    id={id}
                                    label={label}
                                    reference={reference}
                                    link={link}
                                    icon={
                                        tag === 'favorite' ? (
                                            <FavoriteIcon svgClass={styles.svgIconFavoriteXs}/>
                                        ) : (
                                            <span
                                                style={{
                                                    backgroundColor: color,
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    marginLeft: 8,
                                                }}
                                            />
                                        )
                                    }
                                />
                            </ShowcaseTooltip>
                        </li>
                    );
                })}
            </ul>
            <h4 style={{marginBottom: 'auto'}}>
                <Translate id="showcase.filters.title">Language</Translate>
            </h4>
            <ul className={clsx('clean-list', styles.checkboxList)}>
                {TagList.filter(tag => tag.includes('lang')).map((tag, i) => {
                    const {label, description, color} = Tags[tag];
                    const id = `showcase_checkbox_id_${tag}`;

                    return (
                        <li key={i} className={styles.checkboxListItem}>
                            <ShowcaseTooltip
                                id={id}
                                text={description}
                                anchorEl="#__docusaurus">
                                <ShowcaseTagSelect
                                    tag={tag}
                                    id={id}
                                    label={label}
                                    icon={
                                        tag === 'favorite' ? (
                                            <FavoriteIcon svgClass={styles.svgIconFavoriteXs}/>
                                        ) : (
                                            <span
                                                style={{
                                                    backgroundColor: color,
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    marginLeft: 8,
                                                }}
                                            />
                                        )
                                    }
                                />
                            </ShowcaseTooltip>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

const favoriteArticles = sortedArticles.filter((article) =>
    article.tags.includes('favorite'),
);
const otherArticles = sortedArticles.filter(
    (article) => !article.tags.includes('favorite'),
);

function SearchBar() {
  const history = useHistory();
  const location = useLocation();
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    setValue(readSearchName(location.search));
    document.getElementById('searchbar')?.focus();
  }, [location]);
  return (
      <div className={styles.searchContainer}>
        <input
            id="searchbar"
            placeholder={translate({
              message: 'Search for a guide by name...',
              id: 'showcase.searchBar.placeholder',
            })}
            value={value ?? undefined}
            onInput={(e) => {
              setValue(e.currentTarget.value);
              const newSearch = new URLSearchParams(location.search);
              newSearch.delete(SearchNameQueryKey);
              if (e.currentTarget.value) {
                newSearch.set(SearchNameQueryKey, e.currentTarget.value);
              }
              history.push({
                ...location,
                search: newSearch.toString(),
                state: prepareArticleState(),
              });
              setTimeout(() => {
                document.getElementById('searchbar')?.focus();
              }, 0);
            }}
        />
      </div>
  );
}

function ShowcaseCards() {
  const filteredArticles = useFilteredArticles();

  if (filteredArticles.length === 0) {
    return (
        <section className="margin-top--lg margin-bottom--xl">
          <div className="container padding-vert--md text--center">
            <h2>
              <Translate id="showcase.articlesList.noResult">No result</Translate>
            </h2>
            <SearchBar />
          </div>
        </section>
    );
  }

  return (
      <section className="margin-top--lg margin-bottom--xl">
        {filteredArticles.length === sortedArticles.length ? (
            <>
              <div className={styles.showcaseFavorite}>
                <div className="container">
                  <div
                      className={clsx(
                          'margin-bottom--md',
                          styles.showcaseFavoriteHeader,
                      )}>
                    <h2>
                      <Translate id="showcase.favoritesList.title">
                        Our favorites
                      </Translate>
                    </h2>
                    <FavoriteIcon svgClass={styles.svgIconFavorite} />
                    <SearchBar />
                  </div>
                  <ul
                      className={clsx(
                          'container',
                          'clean-list',
                          styles.showcaseList,
                      )}>
                    {favoriteArticles.map((article) => (
                        <ShowcaseCard key={article.title} article={article} />
                    ))}
                  </ul>
                </div>
              </div>
              <div className="container margin-top--lg">
                <h2 className={styles.showcaseHeader}>
                  <Translate id="showcase.articlesList.allArticles">All guides</Translate>
                </h2>
                <ul className={clsx('clean-list', styles.showcaseList)}>
                  {otherArticles.map((article) => (
                      <ShowcaseCard key={article.title} article={article} />
                  ))}
                </ul>
              </div>
            </>
        ) : (
            <div className="container">
              <div
                  className={clsx(
                      'margin-bottom--md',
                      styles.showcaseFavoriteHeader,
                  )}>
                <SearchBar />
              </div>
              <ul className={clsx('clean-list', styles.showcaseList)}>
                {filteredArticles.map((article) => (
                    <ShowcaseCard key={article.title} article={article} />
                ))}
              </ul>
            </div>
        )}
      </section>
  );
}

export default function Showcase(): JSX.Element {
  return (
      <Layout>
        <main className="margin-vert--lg">
          {/* <ShowcaseHeader /> */}
          <ShowcaseFilters />
          <ShowcaseCards />
        </main>
      </Layout>
  );
}