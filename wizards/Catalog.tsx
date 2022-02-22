/* eslint-disable @typescript-eslint/no-empty-function */
import {
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Checkbox,
    Drawer,
    DrawerContent,
    DrawerContentBody,
    DrawerPanelBody,
    DrawerPanelContent,
    DrawerSection,
    Flex,
    FlexItem,
    Label,
    LabelGroup,
    List,
    ListItem,
    Page,
    PageSection,
    SearchInput,
    Split,
    SplitItem,
    Stack,
    Text,
    Title,
} from '@patternfly/react-core'
import { CheckIcon } from '@patternfly/react-icons'
import Fuse from 'fuse.js'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { Masonry } from './Demo'

interface ICatalogBreadcrumb {
    id?: string
    label: string
    to?: string
    target?: string
    component?: React.ElementType
}

type CatalogFilterValue = string | number | boolean

interface ICatalogFilterGroup {
    id: string
    label: string
    filters?: ICatalogFilter[]
}

interface ICatalogFilter {
    id?: string
    label?: string
    value: CatalogFilterValue
    filters?: ICatalogFilter[]
}

interface ICatalogCard {
    id?: string
    title: string
    descriptions?: string[]
    featureGroups?: ICatalogCardFeatureGroup[]
    labels?: string[]
    badge?: string
    onClick: () => void
}

interface ICatalogCardFeatureGroup {
    title: string
    features: string[]
}

const fuseCardOptions: Fuse.IFuseOptions<ICatalogCard> = {
    includeScore: true,
    keys: [
        { name: 'title', weight: 0.35 },
        { name: 'descriptions', weight: 0.15 },
        { name: 'featureGroups.features', weight: 0.15 },
        { name: 'labels', weight: 0.15 },
        { name: 'labels.label', weight: 0.15 },
        { name: 'badge', weight: 0.15 },
    ],
}

export function Catalog(props: {
    title: string
    breadcrumbs?: ICatalogBreadcrumb[]
    filterGroups?: ICatalogFilterGroup[]
    cards?: ICatalogCard[]
}) {
    const breadcrumbs = useMemo(() => {
        if (!props.breadcrumbs) return <Fragment />
        return (
            <Breadcrumb>
                {props.breadcrumbs.map((breadcrumb) => (
                    <BreadcrumbItem
                        id={breadcrumb.id}
                        key={breadcrumb.id}
                        to={breadcrumb.to}
                        target={breadcrumb.target}
                        component={breadcrumb.component}
                    >
                        {breadcrumb.label}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>
        )
    }, [props.breadcrumbs])

    const [search, setSearch] = useState('')

    const [filterSelections, setFilterSelections] = useState<{ [id: string]: CatalogFilterValue[] }>({})

    const onClickFilter = useCallback(
        (filterGroup: ICatalogFilterGroup, filter: ICatalogFilter) => {
            const newSelections = { ...filterSelections }
            const filterGroupSelections = newSelections[filterGroup.id]
            if (!filterGroupSelections) {
                newSelections[filterGroup.id] = [filter.value]
            } else {
                if (filterGroupSelections.includes(filter.value)) {
                    filterGroupSelections.splice(filterGroupSelections.indexOf(filter.value), 1)
                } else {
                    filterGroupSelections.push(filter.value)
                }
            }
            setFilterSelections(newSelections)
        },
        [filterSelections]
    )

    const catalogFilterGroups = useMemo(() => {
        if (!props.filterGroups) return <Fragment />
        return (
            <DrawerPanelContent minSize="250px" defaultSize="250px" maxSize="250px">
                <DrawerPanelBody>
                    {props.filterGroups.map((filterGroup) => (
                        <DrawerSection key={filterGroup.id} style={{ paddingBottom: 32 }}>
                            <FilterGroup
                                filterGroup={filterGroup}
                                selectedValues={filterSelections[filterGroup.id]}
                                onClickFilter={onClickFilter}
                            />
                        </DrawerSection>
                    ))}
                </DrawerPanelBody>
            </DrawerPanelContent>
        )
    }, [props.filterGroups, filterSelections, onClickFilter])

    const filteredCards = useMemo(() => {
        let filteredCards = props.cards
        if (!filteredCards) return undefined
        if (Object.keys(filterSelections).length > 0) {
            for (const key in filterSelections) {
                const t = filterSelections[key]
                if (t.length == 0) continue
                filteredCards = filteredCards?.filter((card) => {
                    return card.labels?.find((label) => {
                        return t.includes(label)
                    })
                })
            }
        }
        return filteredCards
    }, [props.cards, filterSelections])

    const searchedCards = useMemo(() => {
        let activeCards = filteredCards
        if (!activeCards) return undefined
        if (search) {
            const fuse = new Fuse<ICatalogCard>(activeCards, fuseCardOptions)
            activeCards = fuse.search(search).map((result) => result.item)
        } else {
            activeCards = activeCards?.sort((lhs, rhs) => lhs.title.localeCompare(rhs.title))
        }
        return activeCards
    }, [filteredCards, search])

    const catalogCards = useMemo(() => {
        if (!searchedCards) return <Fragment />
        return (
            <Masonry size={470}>
                {searchedCards.map((card) => (
                    <Card id={card.id} key={card.id ?? card.title} onClick={card.onClick} isFlat isLarge isSelectableRaised>
                        <CardHeader>
                            <Split hasGutter style={{ width: '100%' }}>
                                <SplitItem isFilled>
                                    <CardTitle>{card.title}</CardTitle>
                                </SplitItem>
                                {card.badge && (
                                    <SplitItem>
                                        <Label isCompact color="orange">
                                            {card.badge}
                                        </Label>
                                    </SplitItem>
                                )}
                            </Split>
                        </CardHeader>
                        <CardBody>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                                {Array.isArray(card.descriptions) &&
                                    card.descriptions.map((description, index) => (
                                        <Text component="p" key={index}>
                                            {description}
                                        </Text>
                                    ))}
                                {Array.isArray(card.featureGroups) &&
                                    card.featureGroups.map((featureGroup, index) => (
                                        <Stack key={index}>
                                            <Title headingLevel="h6" style={{ paddingBottom: 8 }}>
                                                {featureGroup.title}
                                            </Title>
                                            <List isPlain>
                                                {featureGroup.features?.map((feature, index) => (
                                                    <ListItem key={index} icon={<CheckIcon color="green" size="md" />}>
                                                        {feature}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Stack>
                                    ))}

                                {card.labels && (
                                    <LabelGroup numLabels={999}>
                                        {card.labels.map((label) => (
                                            <Label key={label}>{label}</Label>
                                        ))}
                                    </LabelGroup>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </Masonry>
        )
    }, [searchedCards])

    return (
        <Page>
            <PageSection variant="light" sticky="top" isWidthLimited>
                <Flex style={{ gap: 16 }}>
                    <FlexItem grow={{ default: 'grow' }}>
                        <Stack hasGutter>
                            {breadcrumbs}
                            <Title headingLevel="h1">{props.title}</Title>
                        </Stack>
                    </FlexItem>
                    <FlexItem alignSelf={{ default: 'alignSelfFlexEnd' }} grow={{ default: 'grow' }}>
                        <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} />
                    </FlexItem>
                </Flex>
            </PageSection>
            <PageSection variant="light" padding={{ default: 'noPadding' }} isFilled hasOverflowScroll isWidthLimited>
                <Drawer position="left" isStatic>
                    <DrawerContent panelContent={catalogFilterGroups}>
                        <DrawerContentBody hasPadding>{catalogCards}</DrawerContentBody>
                    </DrawerContent>
                </Drawer>
            </PageSection>
        </Page>
    )
}

function FilterGroup(props: {
    filterGroup: ICatalogFilterGroup
    selectedValues?: CatalogFilterValue[]
    onClickFilter: (filterGroup: ICatalogFilterGroup, filter: ICatalogFilter) => void
}) {
    const { filterGroup, selectedValues, onClickFilter } = props
    return (
        <DrawerSection key={filterGroup.id}>
            <Stack hasGutter>
                <Title headingLevel="h4">{filterGroup.label}</Title>
                {filterGroup.filters?.map((filter) => (
                    <Filter
                        key={filter.id ?? filter.value.toString()}
                        filter={filter}
                        selectedValues={selectedValues}
                        onClick={() => onClickFilter(filterGroup, filter)}
                    />
                ))}
            </Stack>
        </DrawerSection>
    )
}

function Filter(props: { filter: ICatalogFilter; selectedValues?: CatalogFilterValue[]; onClick: () => void }) {
    const { filter, selectedValues, onClick } = props
    return (
        <Fragment>
            <Checkbox
                id={filter.id ?? filter.value.toString()}
                isChecked={selectedValues?.includes(filter.value)}
                onChange={onClick}
                label={filter.label ?? filter.value.toString()}
            />
            {filter.filters && (
                <Stack hasGutter>
                    {filter.filters.map((filter) => (
                        <Filter
                            key={filter.id ?? filter.value.toString()}
                            filter={filter}
                            selectedValues={selectedValues}
                            onClick={onClick}
                        />
                    ))}
                </Stack>
            )}
        </Fragment>
    )
}
