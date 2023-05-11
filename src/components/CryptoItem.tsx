import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRemove} from '@fortawesome/free-solid-svg-icons';


interface CryptoItemProps {
    name: string;
    price: number;
    change: number;
    onDelete: () => void;
}

const CryptoItem = (props: CryptoItemProps) => {
    const classList = ['crypto-item'];
    if (props.change > 0) {
        classList.push('up');
    } else if (props.change < 0) {
        classList.push('down');
    }
    return (
        <li className={classList.join(' ')}>
            <span className="crypto-item__name">{props.name}</span>
            <span className="crypto-item__price">{props.price}</span>
            <FontAwesomeIcon
                className="crypto-item__delete-btn"
                onClick={props.onDelete}
                icon={faRemove}
            />
        </li>
    );
}

export default CryptoItem;