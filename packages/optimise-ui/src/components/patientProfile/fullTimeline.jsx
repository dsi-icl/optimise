import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Timeline from 'react-calendar-timeline/lib';
import { edssAlgorithmFromProps } from '../EDSScalculator/calculator';
import { BackButton } from '../medicalData/utils';
import Helmet from '../scaffold/helmet';
import style from './patientProfile.module.css';
import './timeline.css';

let keys = {
    groupIdKey: 'id',
    groupTitleKey: 'title',
    groupRightTitleKey: 'rightTitle',
    itemIdKey: 'id',
    itemTitleKey: 'title',
    itemDivTitleKey: 'title',
    itemGroupKey: 'group',
    itemTimeStartKey: 'start',
    itemTimeEndKey: 'end'
};

@connect(state => ({
    data: state.patientProfile.data,
    availableFields: state.availableFields
}))
export default class FullTimeline extends Component {
    constructor(props) {
        super(props);

        this.timeBoudary = this.timeBoudary.bind(this);
        this.groupRenderer = this.groupRenderer.bind(this);
        this.itemRenderer = this.itemRenderer.bind(this);

        let defaultTimeStart = moment().subtract(1, 'month').toDate();
        let defaultTimeEnd = moment();
        // let groups = [{
        //     id: 0,
        //     title: 'Immunisations',
        //     root: true
        // }, {
        let groups = [{
            id: 1,
            title: 'Treatments',
            root: true
        }, {
            id: 2,
            title: 'Visits',
            root: true
        }, {
            id: 3,
            title: 'Tests',
            root: true
        }, {
            id: 6,
            title: 'Relapses',
            root: true
        }, {
            id: 4,
            title: 'Adverse Events',
            root: true
        }, {
            id: 5,
            title: 'EDSS',
            root: true
        }];

        this.state = {
            groups,
            items: [],
            defaultTimeStart,
            defaultTimeEnd,
            maxTimeStart: defaultTimeStart,
            openGroups: {},
            now: moment().valueOf()
        };
    }

    static getDerivedStateFromProps(props, state) {

        let items = [];
        let edssPoints = {};
        let maxTimeStart = state.defaultTimeStart;
        // if (props.data.immunisations)
        //     props.data.immunisations.forEach(i => {
        //         if (maxTimeStart.valueOf() > moment(i.immunisationDate, 'x').valueOf())
        //             maxTimeStart = moment(i.immunisationDate, 'x').toDate();
        //         items.push({
        //             id: `im_${i.id}`,
        //             group: 0,
        //             title: `Vaccin ${i.vaccineName}`,
        //             start: moment(i.immunisationDate, 'x').valueOf(),
        //             end: moment(i.immunisationDate, 'x').add(1, 'day').valueOf(),
        //             canMove: false,
        //             canResize: false,
        //             className: style.timelineImmunisationItem,
        //             itemProps: {
        //                 'data-tip': `Vaccin ${i.vaccineName}`
        //             }
        //         });
        //     });
        if (props.data.treatments)
            props.data.treatments.forEach(t => {
                if (maxTimeStart.valueOf() > moment(t.startDate, 'x').valueOf())
                    maxTimeStart = moment(t.startDate, 'x').toDate();
                items.push({
                    id: `#treatment-${t.id}`,
                    interruptions: t.interruptions,
                    group: 1,
                    title: `${props.availableFields.drugs_Hash[0][t.drug].name} (${props.availableFields.drugs_Hash[0][t.drug].module})`,
                    start: moment(t.startDate, 'x').valueOf(),
                    end: t.terminatedDate !== null && t.terminatedDate !== undefined ? moment(t.terminatedDate, 'x').valueOf() : moment().add(12, 'hours').valueOf(),
                    canMove: false,
                    canResize: false,
                    className: style.timelineTreatementItem,
                    itemProps: {
                        'data-tip': `${props.availableFields.drugs_Hash[0][t.drug].name} (${props.availableFields.drugs_Hash[0][t.drug].module})`
                    }
                });
            });
        if (props.data.visits)
            sortVisits(props.data.visits).filter(v => v.type === 1).forEach((v, i) => {
                let suffix;
                switch (++i) {
                    case 1:
                        suffix = 'st';
                        break;
                    case 2:
                        suffix = 'nd';
                        break;
                    case 3:
                        suffix = 'rd';
                        break;
                    default:
                        suffix = 'th';
                };
                if (maxTimeStart.valueOf() > moment(v.visitDate, 'x').valueOf())
                    maxTimeStart = moment(v.visitDate, 'x').toDate();
                items.push({
                    id: `#visit-${v.id}`,
                    group: 2,
                    title: `${i}${suffix} visit ${i === 1 ? '(Baseline)' : ''}`,
                    start: moment(v.visitDate, 'x').valueOf(),
                    end: moment(v.visitDate, 'x').add(1, 'day').valueOf(),
                    canMove: false,
                    canResize: false,
                    className: style.timelineVisitItem,
                    itemProps: {
                        'data-tip': `${i}${suffix} visit ${i === 1 ? '(Baseline)' : ''}`
                    }
                });

                const allSymptoms = v.data.map(symptom => symptom.field);
                const relevantEDSSFields = props.availableFields.visitFields.filter(field => allSymptoms.includes(field.id) && /^edss:(.*)/.test(field.idname));
                const computedEDSS = edssAlgorithmFromProps(relevantEDSSFields, v.data);

                if (computedEDSS && typeof computedEDSS === 'number' && !isNaN(computedEDSS))
                    edssPoints[moment(v.visitDate, 'x').valueOf()] = computedEDSS;
                else {
                    let edssTotalId = props.availableFields.visitFields.filter(el => el.idname === 'edss:expanded disability status scale - estimated total');
                    if (edssTotalId.length > 0) {
                        edssTotalId = edssTotalId[0].id;
                        v.data.filter(el => el.field === edssTotalId).forEach(e => {
                            edssPoints[moment(v.visitDate, 'x').valueOf()] = e.value;
                        });
                    }
                }
            });
        if (props.data.tests)
            props.data.tests.forEach(t => {
                if (maxTimeStart.valueOf() > moment(t.actualOccurredDate, 'x').valueOf())
                    maxTimeStart = moment(t.actualOccurredDate, 'x').toDate();
                if (maxTimeStart.valueOf() > moment(t.expectedOccurDate, 'x').valueOf())
                    maxTimeStart = moment(t.expectedOccurDate, 'x').toDate();
                items.push({
                    id: `#test-${t.id}`,
                    group: 3,
                    title: props.availableFields.testTypes_Hash[0][t.type],
                    start: moment(t.actualOccurredDate || t.expectedOccurDate, 'x').valueOf(),
                    end: moment(t.actualOccurredDate || t.expectedOccurDate, 'x').add(1, 'day').valueOf(),
                    canMove: false,
                    canResize: false,
                    className: style.timelineTestItem,
                    itemProps: {
                        'data-tip': props.availableFields.testTypes_Hash[0][t.type]
                    }
                });
            });
        if (props.data.clinicalEvents)
            props.data.clinicalEvents.forEach(c => {
                if (maxTimeStart.valueOf() > moment(c.dateStartDate, 'x').valueOf())
                    maxTimeStart = moment(c.dateStartDate, 'x').toDate();
                if (maxTimeStart.valueOf() > moment(c.endDate, 'x').valueOf())
                    maxTimeStart = moment(c.endDate, 'x').toDate();
                let severityFieldId = props.availableFields.clinicalEventFields.filter(f => f.idname === 'Severity')[0].id;
                let severityRecord = c.data.filter(d => d.field === severityFieldId)[0];
                items.push({
                    id: `#clinicalEvent-${c.id}`,
                    severity: severityRecord ? severityRecord.value : undefined,
                    group: props.availableFields.clinicalEventTypes_Hash[0][c.type] === 'Relapse' ? 6 : 4,
                    title: props.availableFields.clinicalEventTypes_Hash[0][c.type],
                    start: moment(c.dateStartDate, 'x').valueOf(),
                    end: c.endDate ? moment(c.endDate, 'x').add(1, 'day').valueOf() : moment().add(12, 'hours').valueOf(),
                    canMove: false,
                    canResize: false,
                    className: props.availableFields.clinicalEventTypes_Hash[0][c.type] === 'Relapse' ? style.timelineRelapseItem : style.timelineCEItem,
                    itemProps: {
                        'data-tip': props.availableFields.clinicalEventTypes_Hash[0][c.type]
                    }
                });
            });

        items.push({
            id: 'edss_plotter',
            group: 5,
            start: moment(maxTimeStart).subtract(1, 'day').valueOf(),
            end: moment().add(1, 'day').valueOf(),
            canMove: false,
            canResize: false,
            className: style.timelineEDSSPlotter
        });

        items.push({
            id: 'edss_plotter_padding',
            group: 5,
            start: moment(maxTimeStart).subtract(1, 'day').valueOf(),
            end: moment().add(1, 'day').valueOf(),
            canMove: false,
            canResize: false,
            className: style.timelineEDSSPlotterPad
        });

        return {
            ...state,
            maxTimeStart,
            items,
            edssPoints
        };
    }

    toggleGroup = id => {
        this.setState(prevState => {
            const { openGroups } = prevState;
            return {
                openGroups: {
                    ...openGroups,
                    [id]: !openGroups[id]
                }
            };
        });
    }

    timeBoudary = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
        let now = moment().valueOf();
        this.setState({
            now
        }, () => {
            const minTime = moment(this.state.maxTimeStart).subtract(12, 'hours').valueOf();
            const maxTime = moment().add(12, 'hours').valueOf();
            if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
                updateScrollCanvas(minTime, maxTime);
            } else if (visibleTimeStart < minTime) {
                updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart));
            } else if (visibleTimeEnd > maxTime) {
                updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime);
            } else {
                updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
            }
        });
    }

    groupRenderer({ group }) {
        if (group.root)
            return (
                <div onClick={() => this.toggleGroup(parseInt(group.id))} style={{ cursor: 'pointer' }}>
                    {/* {this.state.openGroups[parseInt(group.id)] ? '[-]' : '[+]'} */} {group.title}
                </div>
            );
        else
            return (
                <div style={{ paddingLeft: 20 }}>{group.title}</div>
            );
    }

    itemRenderer({ item, timelineContext }) {

        if (item.title === 'Relapse') {
            let unit = (timelineContext.visibleTimeEnd - timelineContext.visibleTimeStart);
            let x1 = (parseFloat(item.start) - timelineContext.visibleTimeStart) * timelineContext.timelineWidth / unit;
            if (parseFloat(item.start) > timelineContext.visibleTimeStart)
                x1 = 0;
            let x2 = (parseFloat(item.end) - timelineContext.visibleTimeStart) * timelineContext.timelineWidth / unit;
            if (parseFloat(item.start) > timelineContext.visibleTimeStart)
                x2 = x2 + ((timelineContext.visibleTimeStart - parseFloat(item.start)) * timelineContext.timelineWidth / unit);
            let severityRadius = item.severity === 'Mild' ? 5 : item.severity === 'Moderate' ? 10 : item.severity === 'Severe' ? 15 : 0;

            return (
                <Link to={`/patientProfile/${this.props.match.params.patientId}/${item.id}`}>
                    <div className={style.timelineBackground} style={{ width: timelineContext.timelineWidth }}>
                        <svg height={40} width={timelineContext.timelineWidth}>
                            {x2 - x1 > 5 ?
                                (
                                    <>
                                        <line x1={x1} y1={15} x2={x2} y2={15} className={style.dashed} />
                                        <line x1={x2} y1={10} x2={x2} y2={20} />
                                    </>
                                ) : null}
                            {severityRadius === 0 ?
                                (
                                    <>
                                        <line x1={x1 - 4} y1={15 - 4} x2={x1 + 4} y2={15 + 4} className={style.cross} />
                                        <line x1={x1 - 4} y1={15 + 4} x2={x1 + 4} y2={15 - 4} className={style.cross} />
                                    </>
                                ) : (
                                    <circle cx={x1} cy={15} r={severityRadius} />
                                )
                            }
                        </svg>
                    </div>
                </Link>
            );
        } else if (item.interruptions !== undefined) {

            let overlays = [];
            let unit = (timelineContext.visibleTimeEnd - timelineContext.visibleTimeStart);
            let x1i = (parseFloat(item.start) - timelineContext.visibleTimeStart) * timelineContext.timelineWidth / unit;

            item.interruptions.forEach(i => {
                let x1 = (parseFloat(i.startDate) - timelineContext.visibleTimeStart) * timelineContext.timelineWidth / unit;
                if (parseFloat(item.start) > timelineContext.visibleTimeStart)
                    x1 = x1 - x1i;
                let x2 = (parseFloat(i.endDate || moment().add(1, 'day').valueOf()) - timelineContext.visibleTimeStart) * timelineContext.timelineWidth / unit;
                if (parseFloat(item.start) > timelineContext.visibleTimeStart)
                    x2 = x2 - x1i;

                let stripStart = x1 - 40;
                let strips = [];
                while (stripStart < x2) {
                    if (stripStart > -40 && stripStart < timelineContext.timelineWidth)
                        strips.push(<line key={`${i.id}_${stripStart}`} x1={stripStart} y1={40} x2={stripStart + 40} y2={0} clipPath={`url(#${i.id}_mask)`} />);
                    stripStart += 5;
                }
                overlays.push(
                    <Fragment key={i.id}>
                        <defs>
                            <clipPath id={`${i.id}_mask`}>
                                <rect x={x1} y={0} width={x2 - x1} height='100%' />
                            </clipPath>
                        </defs>
                        {strips}
                    </Fragment>
                );
            });
            if (parseFloat(item.start) > timelineContext.visibleTimeStart)
                x1i = 0;
            let x2i = (parseFloat(item.end) - timelineContext.visibleTimeStart) * timelineContext.timelineWidth / unit;
            if (parseFloat(item.start) > timelineContext.visibleTimeStart)
                x2i = x2i + ((timelineContext.visibleTimeStart - parseFloat(item.start)) * timelineContext.timelineWidth / unit);
            return (
                <Link to={`/patientProfile/${this.props.match.params.patientId}/${item.id}`}>
                    <div className={style.timelineBackground} style={{ width: (x2i - x1i), maxWidth: timelineContext.timelineWidth }}>
                        <svg height={40} width={timelineContext.timelineWidth}>
                            {overlays}
                        </svg>
                    </div>
                    <div className={style.timelineTextContent}>{item.title}</div>
                </Link>
            );
        } else if (item.id === 'edss_plotter') {
            let unit = (timelineContext.visibleTimeEnd - timelineContext.visibleTimeStart);
            let previous = null;
            return (
                <div className={`${style.timelineBackground} ${item.className}`} style={{ width: timelineContext.timelineWidth }}>
                    <svg height={40} width={timelineContext.timelineWidth}>
                        {Object.keys(this.state.edssPoints).sort((a, b) => a - b).map(k => {
                            let x = (parseFloat(k) - timelineContext.visibleTimeStart) * timelineContext.timelineWidth / unit;
                            let y = 65 - (65 * parseFloat(this.state.edssPoints[k]) / 10);
                            let line = previous ? <line x1={previous[0]} y1={previous[1]} x2={x} y2={y} /> : null;
                            let point = <circle cx={x} cy={y} r={2} />;
                            let text = <text x={x} y={y > 60 ? y - 8 : y + 15} textAnchor="middle">{this.state.edssPoints[k]}</text>;
                            previous = [x, y];
                            return <Fragment key={k}>{text}{point}{line}</Fragment>;
                        })}
                    </svg>
                </div>
            );
        }
        return (
            <Link to={`/patientProfile/${this.props.match.params.patientId}/${item.id}`}>
                <div className={style.timelineBackground}></div>
                <div className={style.timelineTextContent}>{item.title}</div>
            </Link>);
    }

    render() {
        const {
            groups,
            items,
            defaultTimeStart,
            defaultTimeEnd
        } = this.state;

        // hide (filter) the groups that are closed, for the rest, patch their "title" and add some callbacks or padding

        if (this.props.match.params === undefined)
            return null;
        return (
            <>
                <div className={style.ariane}>
                    <Helmet title='Patient Timeline' />
                    <h2>Patient Timeline ({this.props.match.params.patientId})</h2>
                    <BackButton to={`/patientProfile/${this.props.match.params.patientId}`} />
                </div>
                <div className={style.panel}>
                    <div>
                        <i>This timeline allows you to browse through the patient history from the date of the first recorded event to today</i><br /><br />
                    </div>
                    <Timeline
                        groups={groups}
                        groupRenderer={this.groupRenderer}
                        items={items}
                        itemRenderer={this.itemRenderer}
                        keys={keys}
                        maxZoom={50 * 365.24 * 86400 * 1000}
                        showCursorLine
                        sidebarWidth={150}
                        stackItems
                        itemsSorted
                        minimumWidthForItemContentVisibility={0}
                        itemTouchSendsClick={false}
                        itemHeightRatio={0.75}
                        lineHeight={40}
                        defaultTimeStart={defaultTimeStart}
                        defaultTimeEnd={defaultTimeEnd}
                        onTimeChange={this.timeBoudary}
                    />
                    <br /><br />
                    <div>
                        To interact and navigate within the timeline you can click-hold then drag<br />
                        Also, the following options are available:<br /><br />
                        <div className={style.keyboardGroup}>
                            <pre className={style.keyboardKey}>shift</pre> + <pre className={style.keyboardKey}>mousewheel</pre> = move timeline left/right<br />
                            <pre className={style.keyboardKey}>alt</pre> + <pre className={style.keyboardKey}>mousewheel</pre> = zoom in/out<br />
                            <pre className={style.keyboardKey}>ctrl</pre> + <pre className={style.keyboardKey}>mousewheel</pre> = zoom in/out 10× faster<br />
                            <pre className={style.keyboardKey}>meta/alt</pre> + <pre className={style.keyboardKey}>mousewheel</pre> = zoom in/out 3x faster<br /><br />
                        </div>
                        And you can use pinch-in and pinch-out zoom gestures (two touch points) on touch screens.<br />
                    </div>
                </div>
            </>
        );
    }
}

function sortVisits(visitList) {
    const visits = [...visitList];
    return visits.sort((a, b) => parseInt(a.visitDate, 10) < parseInt(b.visitDate, 10));
}