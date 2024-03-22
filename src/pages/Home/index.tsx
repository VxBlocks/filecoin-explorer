/** @format */

import React from 'react';
import SearchHead from './SearchHead/SearchHead';
import './index.less';
import HomeCard from './HomeCard/HomeCard';
const HomePage = () => {
    return (
        <div className="Home-container">
            <SearchHead />
            <HomeCard />
        </div>
    );
};

export default HomePage;
