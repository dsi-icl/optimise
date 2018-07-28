import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Timeline from 'react-calendar-timeline/lib';
import { BackButton } from '../medicalData/dataPage';
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

        let defaultTimeStart = moment().startOf('day').toDate();
        let defaultTimeEnd = moment();
        let groups = [{
            id: 0,
            title: 'Immunisations',
            root: true
        }, {
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
            id: 4,
            title: 'Clinical Event',
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
            openGroups: {}
        };
    }

    static getDerivedStateFromProps(props, state) {

        let items = [];
        let maxTimeStart = state.defaultTimeStart;
        if (props.data.immunisations)
            props.data.immunisations.forEach(i => {
                if (maxTimeStart.valueOf() > moment(i.immunisationDate, 'x').valueOf())
                    maxTimeStart = moment(i.immunisationDate, 'x').toDate();
                items.push({
                    id: `im_${i.id}`,
                    group: 0,
                    title: `Vaccin ${i.vaccineName}`,
                    start: moment(i.immunisationDate, 'x').valueOf(),
                    end: moment(i.immunisationDate, 'x').add(1, 'day').valueOf(),
                    canMove: false,
                    canResize: false,
                    className: style.timelineImmunisationItem,
                    itemProps: {
                        'data-tip': `Vaccin ${i.vaccineName}`
                    }
                });
            });
        if (props.data.treatments)
            props.data.treatments.forEach(t => {
                if (maxTimeStart.valueOf() > moment(t.startDate, 'x').valueOf())
                    maxTimeStart = moment(t.startDate, 'x').toDate();
                items.push({
                    id: `tr_${t.id}`,
                    group: 1,
                    title: `${props.availableFields.drugs_Hash[0][t.drug].name} (${props.availableFields.drugs_Hash[0][t.drug].module})`,
                    start: moment(t.startDate, 'x').valueOf(),
                    end: t.terminatedDate !== null ? moment(t.terminatedDate, 'x').valueOf() : moment().add(12, 'hours').valueOf(),
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
                    id: `vi_${v.id}`,
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
            });
        if (props.data.tests)
            props.data.tests.forEach(t => {
                if (maxTimeStart.valueOf() > moment(t.expectedOccurDate, 'x').valueOf())
                    maxTimeStart = moment(t.expectedOccurDate, 'x').toDate();
                items.push({
                    id: `te_${t.id}`,
                    group: 3,
                    title: props.availableFields.testTypes_Hash[0][t.type],
                    start: moment(t.expectedOccurDate, 'x').valueOf(),
                    end: moment(t.expectedOccurDate, 'x').add(1, 'day').valueOf(),
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
                items.push({
                    id: `cl_${c.id}`,
                    group: 4,
                    title: props.availableFields.clinicalEventTypes_Hash[0][c.type],
                    start: moment(c.dateStartDate, 'x').valueOf(),
                    end: c.endDate ? moment(c.endDate, 'x').add(1, 'day').valueOf() : moment(c.dateStartDate, 'x').add(1, 'hour').valueOf(),
                    canMove: false,
                    canResize: false,
                    className: style.timelineCEItem,
                    itemProps: {
                        'data-tip': props.availableFields.clinicalEventTypes_Hash[0][c.type]
                    }
                });
            });

        return Object.assign(state, {
            maxTimeStart,
            items
        });
    }

    toggleGroup = id => {
        const { openGroups } = this.state;
        this.setState({
            openGroups: {
                ...openGroups,
                [id]: !openGroups[id]
            }
        });
    }

    timeBoudary = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
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
        return (
            <>
                <div className={`${style.timelineBackground} ${item.className}`}></div>
                <div className={style.timelineTextContent}>{item.title}</div>
            </>);
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
                        showCursorLine
                        sidebarWidth={150}
                        stackItems
                        itemsSorted
                        itemTouchSendsClick={false}
                        itemHeightRatio={0.75}
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