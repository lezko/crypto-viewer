import React, {Component} from 'react';

interface CryptoItemProps {
    name: string;
    price: number;
    change: number;
    onDelete: () => void;
}
class CryptoItem extends Component<CryptoItemProps> {
    render() {
        return (
            <li className='crypto-item'>
                <span>{this.props.name}</span>
                <span>{this.props.price}</span>
                <span>{this.props.change > 0 ? 'up' : this.props.change < 0 ? 'down' : ''}</span>
                <button
                    onClick={this.props.onDelete}
                >Delete</button>
            </li>
        );
    }
}

export default CryptoItem;