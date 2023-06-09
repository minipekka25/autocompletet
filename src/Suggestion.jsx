import React, {PropTypes} from 'react';
import { scrollIntoView, getNodeById } from './utils';

const KEYS_EVENT = {
  UP: 38,
  DOWN: 40,
  ESCAPE: 27,
  ENTER: 13
};

class Suggestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      dataLength: 0,
      currentValue: null,
      selectedItem: null,
      isOutsideClick: false,
      isOpen: false,
      highlightedIndex: 0,
      searchHistory:[]
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.clickOutside);
    if (this.props.initInputValue) {
      this.setState({
        inputValue: this.props.initInputValue,
        dataLength: this.props.items.length
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items.length !== this.props.items.length) {
      this.setState({
        dataLength: nextProps.items.length
      });
    }
    if (nextProps.initInputValue !== this.props.initInputValue) {
      this.setState({
        inputValue: nextProps.initInputValue || ''
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.clickOutside);
  }

  onChange = e => {
    this.props.onOpen()
    this.setState({
      inputValue: e.target.value,
      isOpen: true
    });
  };

  closeDropDown = () => {
    this.setState({isOpen: false})
    this.props.onClose()
  }

  onBlurInput = e => {
    if (this.state.isOutsideClick) {
      this.setState({
        isOpen: false
      });
    }
  };

  onFocusInput = e => {
    this.props.onOpen()
    this.setState({
      isOutsideClick: false,
      isOpen: true
    });
  };

  onSelectItem = item => {
    let displayName = {};
    if (this.props.getDisplayName) {
      displayName = {
        inputValue: this.props.getDisplayName(item) || ''
      };
    }

    if (this.props.onSelectedItem) {
      this.props.onSelectedItem(item);
    }
    this.props.onClose()
    this.setState(prev => {return{
      selectedItem: item,
      searchHistory:[{value:item || prev.inputValue,term:prev.inputValue,suggestions:[...this.props.items]}, ...prev.searchHistory.slice(0, 4)],
      isOpen: false,
      ...displayName
    }});
  };

  

  onKeyDown = e => {
    let itemIndex = this.state.highlightedIndex;
    if (this.state.isOpen && !this.state.isOutsideClick) {
      switch (e.keyCode) {
        case KEYS_EVENT.UP:
          {
            itemIndex--;
            if (itemIndex < 0) {
              itemIndex = 0;
            }
          }
          break;
        case KEYS_EVENT.DOWN:
          {
            itemIndex++;
            if (itemIndex + 1 > this.state.dataLength) {
              itemIndex = this.state.dataLength - 1;
            }
          }
          break;
        case KEYS_EVENT.ENTER:
          {
            this.onSelectItem(this.props.items[itemIndex]);
          }
          break;
        default:
          itemIndex = -1;
          break;
      }

      const item = getNodeById(`item_${itemIndex}`);
      if (!item) return;
      const container = getNodeById('__listItemProps');
      scrollIntoView(item, container);

      this.setState({
        highlightedIndex: itemIndex
      });
    }
  };

  getInputProps = props => {
    const {
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      placeholder
    } = props;
    const { inputValue } = this.state;

    const onKeyDown = e => {
      this.onKeyDown(e);
      if (typeof handleKeyDown === 'function') {
        handleKeyDown(e);
      }
    };

    const onChange = e => {
      this.onChange(e);
      if (typeof handleChange === 'function') {
        handleChange(e);
      }
    };

    const onBlur = e => {
      this.onBlurInput(e);
      if (typeof handleBlur === 'function') {
        handleBlur(e);
      }
    };

    const onFocus = e => {
      this.onFocusInput(e);
      if (typeof handleFocus === 'function') {
        handleFocus(e);
      }
    };

    return {
      ...props,
      id: '__inputItemProps',
      placeholder,
      onKeyDown,
      onChange,
      onBlur,
      onFocus,
      value: inputValue
    };
  };

  getListItemProps = props => {
    return {
      id: '__listItemProps'
    };
  };

  getItemProps = props => {
    const { item, index, handleSelectItem } = props;
    const onClick = e => {
      this.onSelectItem(item);
      if (typeof handleSelectItem === 'function') {
        handleSelectItem(e.target.value);
      }
    };
    return {
      onClick,
      id: `item_${index}`
    };
  };

  clickOutside = e => {
    if (this.__autoComplete && !this.__autoComplete.contains(e.target)) {
      this.setState({
        isOutsideClick: true,
        isOpen: false
      });
    }
  };

  clearInputValue = () => {
    this.setState({
      inputValue: ''
    });
  };

  setSelectedItem = (item) => {
    this.setState({
      selectedItem: item,
      inputValue:item
    });
  }

  render() {
    const { inputValue, selectedItem, isOpen, highlightedIndex, searchHistory } = this.state;
    const { items, id = 'autoComplete' } = this.props;
    return (
      <div id={id} ref={el => (this.__autoComplete = el)} style={{width:"100%",maxWidth:"600px"}}>
        {this.props.children({
          getInputProps: this.getInputProps,
          getItemProps: this.getItemProps,
          getListItemProps: this.getListItemProps,
          clearInputValue: this.clearInputValue,
          setSelectedItem: this.setSelectedItem,
          inputValue,
          selectedItem,
          isOpen,
          items,
          highlightedIndex,
          searchHistory,
          closeDropDown: this.closeDropDown,
        })}
      </div>
    );
  }
}

// Suggestion.propTypes = {
//   children: PropTypes.func.isRequired,
//   items: PropTypes.array.isRequired,
//   initInputValue: PropTypes.string,
//   placeholder: PropTypes.string,
//   id: PropTypes.string,
//   onSelectedItem: PropTypes.func,
//   onChange: PropTypes.func,
//   onBlur: PropTypes.func,
//   onFocus: PropTypes.func,
//   handleSelectItem: PropTypes.func,
//   getDisplayName: PropTypes.func
// };

// Suggestion.defaultProps = {
//   items: []
// };

export default Suggestion;