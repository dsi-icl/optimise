import React, { Component } from 'react';
import moment from 'moment';
import Timeline from 'react-calendar-timeline/lib';
import style from './patientProfile.module.css';

const minDate = moment('1/1/2018').toDate();
const maxDate = moment('1/8/2018').toDate();

const oneDay = 1000 * 60 * 60 * 24;
const oneWeek = oneDay * 7;

const calculateSize = (timeStart, timeEnd) => {
    const zoom = timeEnd - timeStart;

    return zoom > oneDay ? zoom > oneWeek ? 'small' : 'medium' : 'large';
};

class TeamItemRenderer extends Component {
    shouldComponentUpdate({ timelineContext }) {
        const { visibleTimeStart: nextStart, visibleTimeEnd: nextEnd } = timelineContext;
        const { visibleTimeStart: currentStart, visibleTimeEnd: currentEnd } = this.props.timelineContext;
        return calculateSize(nextStart, nextEnd) !== calculateSize(currentStart, currentEnd);
    }

    render() {
        const { item, timelineContext } = this.props;
        const { visibleTimeStart, visibleTimeEnd } = timelineContext;
        const size = calculateSize(visibleTimeStart, visibleTimeEnd);

        if (size === 'small') {
            return <Small item={item} />;
        } else if (size === 'medium') {
            return <Medium item={item} />;
        } else {
            return <Large item={item} />;
        }
    }
}

const Small = ({ item }) => {
    const { homeTeam, awayTeam } = item;
    return (
        <div>
            <img height={30} width={30} alt='' src={homeTeam.logoUrl} />
            <img height={30} width={30} alt='' src={awayTeam.logoUrl} />
        </div>
    );
};

const Medium = ({ item }) => {
    const { homeTeam, awayTeam } = item;
    return (
        <div>
            <img height={50} width={50} alt='' src={homeTeam.logoUrl} />
            <img height={50} width={50} alt='' src={awayTeam.logoUrl} />
        </div>
    );
};

const Large = ({ item }) => {
    const { homeTeam, awayTeam } = item;
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                    <img height={40} width={40} alt='' src={homeTeam.logoUrl} />
                </div>
                <div style={{ textDecoration: 'underline' }}>
                    {homeTeam.nickname}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img style={{ display: 'block' }} height={50} width={50} alt='' src={awayTeam.logoUrl} />
                <div style={{ textDecoration: 'underline' }}>
                    {awayTeam.nickname}
                </div>
            </div>
        </div>
    );
};

const keys = {
    groupIdKey: 'id',
    groupTitleKey: 'title',
    groupRightTitleKey: 'rightTitle',
    itemIdKey: 'id',
    itemTitleKey: 'title', // key for item div content
    itemDivTitleKey: 'title', // key for item div title (<div title="text"/>)
    itemGroupKey: 'group',
    itemTimeStartKey: 'start',
    itemTimeEndKey: 'end'
};

const twolves = {
    id: 1,
    nickname: 'Timberwolves',
    location: 'Minnesota',
    logoUrl:
        'http://www.freepngimg.com/download/minnesota_timberwolves/2-2-timberwolves-logo.png'
};

const lakers = {
    id: 2,
    nickname: 'Lakers',
    location: 'Los Angeles',
    logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/1000px-Los_Angeles_Lakers_logo.svg.png'
};
const bulls = {
    id: 3,
    nickname: 'Bulls',
    location: 'Chicago',
    logoUrl:
        'https://upload.wikimedia.org/wikipedia/en/thumb/6/67/Chicago_Bulls_logo.svg/762px-Chicago_Bulls_logo.svg.png'
};

const cavs = {
    id: 4,
    nickname: 'Cavaliers',
    location: 'Cleveland',
    logoUrl:
        'https://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/cavaliers/images/170531-partial-logo.png'
};

const westernConference = {
    id: 1,
    title: 'Western Conference'
};
const easternConference = {
    id: 2,
    title: 'Eastern Conference'
};

const groups = [westernConference, easternConference];

const matchups = [
    {
        id: 1,
        group: westernConference.id,
        homeTeam: lakers,
        awayTeam: twolves,
        start: moment('2018-01-02').toDate(),
        end: moment('2018-01-03').toDate()
    },
    {
        id: 2,
        group: westernConference.id,
        homeTeam: lakers,
        awayTeam: cavs,
        start: moment('2018-01-03').toDate(),
        end: moment('2018-01-04').toDate()
    },
    {
        id: 3,
        group: westernConference.id,
        homeTeam: twolves,
        awayTeam: lakers,
        start: moment('2018-01-06').toDate(),
        end: moment('2018-01-07').toDate()
    }, {
        id: 4,
        group: easternConference.id,
        homeTeam: cavs,
        awayTeam: bulls,
        start: moment('2018-01-06').toDate(),
        end: moment('2018-01-07').toDate()
    },
    {
        id: 5,
        group: easternConference.id,
        homeTeam: lakers,
        awayTeam: twolves,
        start: moment('2018-01-06').toDate(),
        end: moment('2018-01-07').toDate()
    },
    {
        id: 6,
        group: easternConference.id,
        homeTeam: bulls,
        awayTeam: twolves,
        start: moment('2018-01-02').toDate(),
        end: moment('2018-01-03').toDate()
    }
];

export default class FullTimeline extends Component {
    constructor(props) {
        super(props);

        const defaultTimeStart = minDate;
        const defaultTimeEnd = maxDate;

        this.state = {
            groups,
            items: matchups,
            defaultTimeStart,
            defaultTimeEnd
        };
    }

    render() {
        const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state;
        return (
            <>
                {/* <div className={style.ariane}>
                    <h2>Patient Timeline ({this.props.match.params.patientId})</h2>
                </div> */}
                <div className={style.panelByPass}>
                    <Timeline
                        lineHeight={60}
                        groups={groups}
                        keys={keys}
                        items={items}
                        itemRenderer={TeamItemRenderer}
                        itemsSorted
                        itemTouchSendsClick={false}
                        stackItems
                        itemHeightRatio={0.75}
                        showCursorLine
                        canMove={false}
                        canResize={false}
                        defaultTimeStart={defaultTimeStart}
                        defaultTimeEnd={defaultTimeEnd}
                    />
                </div>
            </>
        );
    }
}
