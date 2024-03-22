import React, {useEffect, useState} from 'react';

interface CheckProps {
    defImage: React.ReactNode;
    checkImage: React.ReactNode;
}
const CheckImage = (props: CheckProps) => {
    const {defImage, checkImage} = props;
    const [isHover, setHover] = useState(false);

    const handleMouseEnter = () => {
        setHover(true);
    };
    const handleMouseLeave = () => {
        setHover(false);
    };
    return (
        <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {isHover ? checkImage : defImage}
        </span>
    );
};

export default CheckImage;
