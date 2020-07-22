import React, {Component} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import solarLunar from 'solarlunar';
import {shouldUpdate} from '../../../component-updater';
import Dot from '../../dot';
import styleConstructor from './style';


class Day extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),
    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object,
    disableAllTouchEventsForDisabledDays: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);

    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }
  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['state', 'children', 'marking', 'onPress', 'onLongPress']);
  }

  render() {
    const {theme, disableAllTouchEventsForDisabledDays} = this.props;
    const containerStyle = [this.style.base, {height: 50, width: 50}];
    const textStyle = [this.style.text];
// console.log(containerStyle)
    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true
      };
    }

    const isDisabled = typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled';
    const isToday = this.props.state === 'today';

    const {
      marked,
      dotColor,
      selected,
      selectedColor,
      selectedTextColor,
      activeOpacity,
      disableTouchEvent
    } = marking;

    if (selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);

      if (selectedColor) {
        containerStyle.push({backgroundColor: selectedColor, borderRadius: 25});
      }

      if (selectedTextColor) {
        textStyle.push({color: selectedTextColor});
      }

    } else if (isDisabled) {
      textStyle.push(this.style.disabledText);
    } else if (isToday) {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }

    let shouldDisableTouchEvent = false;
    if (typeof disableTouchEvent === 'boolean') {
      shouldDisableTouchEvent = disableTouchEvent;
    } else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && isDisabled) {
      shouldDisableTouchEvent = disableAllTouchEventsForDisabledDays;
    }
    const solar2lunarData = solarLunar.solar2lunar(this.props?.date?.year, this.props?.date?.month, this.props?.date?.day)
    const text = `${solar2lunarData?.lDay}/${solar2lunarData?.lMonth}`;
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={containerStyle}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}
        activeOpacity={activeOpacity}
        disabled={shouldDisableTouchEvent}
        accessibilityRole={isDisabled ? undefined : 'button'}
        accessibilityLabel={this.props.accessibilityLabel}
      >
        <Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text>
        <Text allowFontScaling={false} style={[textStyle, {fontSize: 12, marginTop: -5}]}>{text}</Text>
        <Dot
          theme={theme}
          isMarked={marked}
          dotColor={dotColor}
          isSelected={selected}
          isToday={isToday}
          isDisabled={isDisabled}
        />
      </TouchableOpacity>
    );
  }
}

export default Day;
