/** @format */

import React from 'react';
import Hcard from '../components/Hcard';
import HomeCard_1 from './HomeCard_1/HomeCard_1';
import HomeCard_2 from './HomeCard_2/HomeCard_2';
import HomeCard_3 from './HomeCard_3/HomeCard_3';
import HomeCard_4 from './HomeCard_4/HomeCard_4';

const HomeCard = () => {
    return (
        <div style={{height: '100%', width: '100%'}}>
            <div
                className="cardBox"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridGap: '20px 20px',
                }}
            >
                <HomeCard_1 />
                <HomeCard_2 />
                <HomeCard_3 />
                <HomeCard_4 />
            </div>
        </div>
    );
};

export default HomeCard;
