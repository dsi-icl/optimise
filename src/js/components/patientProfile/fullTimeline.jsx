import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Timeline from 'react-calendar-timeline/lib';
import { BackButton } from '../medicalData/dataPage';
import Helmet from '../scaffold/helmet';
import style from './patientProfile.module.css';

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

@connect(state => ({ data: state.patientProfile.data }))
export default class FullTimeline extends Component {
    constructor(props) {
        super(props);

        this.timeBoudary = this.timeBoudary.bind(this);

        let defaultTimeStart = moment().startOf('day').toDate();
        let defaultTimeEnd = moment();

        this.state = {
            groups: [],
            items: [],
            defaultTimeStart,
            defaultTimeEnd,
            maxTimeStart: defaultTimeStart,
            openGroups: {}
        };
    }

    static getDerivedStateFromProps(props, state) {

        let items = [];
        let groups = [{
            id: 1,
            title: 'Visits',
            tip: 'additional information',
            root: true
        }, {
            id: 2,
            title: 'Tests',
            tip: 'additional information',
            root: true
        }, {
            id: 3,
            title: 'Clinical Event',
            tip: 'additional information',
            root: true
        }];

        let maxTimeStart = state.defaultTimeStart;
        if (props.data.visits)
            props.data.visits.forEach(v => {
                if (maxTimeStart.valueOf() > moment(v.visitDate, 'x').valueOf())
                    maxTimeStart = moment(v.visitDate, 'x').toDate();
                items.push({
                    id: `v_${v.id}`,
                    group: 1,
                    title: `Visit ${v.id}`,
                    start: moment(v.visitDate, 'x').valueOf(),
                    end: moment(v.visitDate, 'x').add(1, 'day').valueOf(),
                    canMove: false,
                    canResize: false,
                    className: style.timelineVisitItem,
                    itemProps: {
                        'data-tip': `Visit ${v.id}`
                    }
                });
            });
        if (props.data.tests)
            props.data.tests.forEach(t => {
                if (maxTimeStart.valueOf() > moment(t.expectedOccurDate, 'x').valueOf())
                    maxTimeStart = moment(t.expectedOccurDate, 'x').toDate();
                items.push({
                    id: `t_${t.id}`,
                    group: 2,
                    title: `Test ${t.id}`,
                    start: moment(t.expectedOccurDate, 'x').valueOf(),
                    end: moment(t.expectedOccurDate, 'x').add(1, 'day').valueOf(),
                    canMove: false,
                    canResize: false,
                    className: style.timelineTestItem,
                    itemProps: {
                        'data-tip': `Test ${t.id}`
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
                    id: `c_${c.id}`,
                    group: 3,
                    title: `Test ${c.id}`,
                    start: moment(c.dateStartDate, 'x').valueOf(),
                    end: moment(c.endDate, 'x').add(1, 'day').valueOf(),
                    canMove: false,
                    canResize: false,
                    className: style.timelineCEItem,
                    itemProps: {
                        'data-tip': `Test ${c.id}`
                    }
                });
            });

        return Object.assign(state, {
            maxTimeStart,
            items,
            groups
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

    render() {
        const {
            groups,
            items,
            defaultTimeStart,
            defaultTimeEnd,
            openGroups
        } = this.state;

        // hide (filter) the groups that are closed, for the rest, patch their "title" and add some callbacks or padding
        const newGroups = groups
            .filter(g => g.root || openGroups[g.parent])
            .map(group => {
                return Object.assign({}, group, {
                    title: group.root ? (
                        <div
                            onClick={() => this.toggleGroup(parseInt(group.id))}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* {openGroups[parseInt(group.id)] ? '[-]' : '[+]'} */} {group.title}
                        </div>
                    ) : (
                            <div style={{ paddingLeft: 20 }}>{group.title}</div>
                        )
                });
            });

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
                    <Timeline
                        groups={newGroups}
                        items={items}
                        keys={keys}
                        sidebarWidth={150}
                        itemsSorted
                        itemTouchSendsClick={false}
                        itemHeightRatio={0.75}
                        defaultTimeStart={defaultTimeStart}
                        defaultTimeEnd={defaultTimeEnd}
                        onTimeChange={this.timeBoudary}
                    />
                </div>
            </>
        );
    }
}