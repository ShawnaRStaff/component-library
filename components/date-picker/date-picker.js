/**
 * Date Picker Component
 *
 * Calendar-based date selection functionality.
 */

class DatePicker {
  constructor(element, options = {}) {
    this.element = element;
    this.input = element.querySelector('.date-picker__input');
    this.calendar = element.querySelector('.date-picker__calendar');
    this.selectedDate = options.value ? new Date(options.value) : null;
    this.currentMonth = this.selectedDate ? new Date(this.selectedDate) : new Date();
    this.options = {
      format: options.format || 'MMMM d, yyyy',
      minDate: options.minDate || null,
      maxDate: options.maxDate || null,
      disabledDates: options.disabledDates || [],
      onChange: options.onChange || (() => {}),
      ...options
    };

    this.init();
  }

  init() {
    this.bindEvents();
    if (this.selectedDate) {
      this.updateInput();
    }
  }

  bindEvents() {
    // Toggle calendar on input click/focus
    this.input.addEventListener('click', () => this.toggle());
    this.input.addEventListener('focus', () => this.open());

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) {
        this.close();
      }
    });

    // Navigation buttons
    this.calendar.addEventListener('click', (e) => {
      const navBtn = e.target.closest('.date-picker__nav-btn');
      if (navBtn) {
        const isNext = navBtn.querySelector('path[d*="7.293"]');
        if (isNext) {
          this.nextMonth();
        } else {
          this.prevMonth();
        }
      }

      // Day selection
      const day = e.target.closest('.date-picker__day');
      if (day && !day.classList.contains('date-picker__day--disabled')) {
        this.selectDay(parseInt(day.textContent));
      }

      // Today button
      if (e.target.classList.contains('date-picker__today')) {
        this.goToToday();
      }

      // Clear button
      if (e.target.classList.contains('date-picker__clear')) {
        this.clear();
      }
    });

    // Keyboard navigation
    this.element.addEventListener('keydown', (e) => {
      if (!this.isOpen()) return;

      switch (e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.adjustDate(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.adjustDate(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.adjustDate(-7);
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.adjustDate(7);
          break;
        case 'Enter':
          e.preventDefault();
          if (this.selectedDate) {
            this.close();
          }
          break;
      }
    });
  }

  open() {
    this.element.classList.add('is-open');
    this.render();
  }

  close() {
    this.element.classList.remove('is-open');
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  isOpen() {
    return this.element.classList.contains('is-open');
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.render();
  }

  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.render();
  }

  selectDay(day) {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    this.selectedDate = new Date(year, month, day);
    this.updateInput();
    this.render();
    this.options.onChange(this.selectedDate);
    this.close();
  }

  adjustDate(days) {
    if (!this.selectedDate) {
      this.selectedDate = new Date();
    }
    this.selectedDate.setDate(this.selectedDate.getDate() + days);
    this.currentMonth = new Date(this.selectedDate);
    this.updateInput();
    this.render();
  }

  goToToday() {
    this.selectedDate = new Date();
    this.currentMonth = new Date();
    this.updateInput();
    this.render();
    this.options.onChange(this.selectedDate);
  }

  clear() {
    this.selectedDate = null;
    this.input.value = '';
    this.render();
    this.options.onChange(null);
  }

  updateInput() {
    if (this.selectedDate) {
      this.input.value = this.formatDate(this.selectedDate);
    }
  }

  formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  isDisabled(date) {
    if (this.options.minDate && date < this.options.minDate) return true;
    if (this.options.maxDate && date > this.options.maxDate) return true;
    return this.options.disabledDates.some(d =>
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  }

  isToday(date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  }

  isSelected(date) {
    if (!this.selectedDate) return false;
    return date.getFullYear() === this.selectedDate.getFullYear() &&
           date.getMonth() === this.selectedDate.getMonth() &&
           date.getDate() === this.selectedDate.getDate();
  }

  render() {
    // This would regenerate the calendar HTML
    // For the static demo, we just highlight the current state
    const days = this.calendar.querySelectorAll('.date-picker__day');
    days.forEach(day => {
      day.classList.remove('date-picker__day--selected');
    });

    if (this.selectedDate) {
      // Find and select the matching day
      days.forEach(day => {
        if (!day.classList.contains('date-picker__day--outside') &&
            parseInt(day.textContent) === this.selectedDate.getDate()) {
          day.classList.add('date-picker__day--selected');
        }
      });
    }
  }
}

function initDatePicker(container) {
  // Handle input clicks to toggle calendar
  const pickers = container.querySelectorAll('.date-picker');

  pickers.forEach(picker => {
    const input = picker.querySelector('.date-picker__input');
    const calendar = picker.querySelector('.date-picker__calendar');

    if (input && calendar) {
      input.addEventListener('click', (e) => {
        e.stopPropagation();
        picker.classList.toggle('is-open');
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!picker.contains(e.target)) {
          picker.classList.remove('is-open');
        }
      });

      // Day selection
      const days = calendar.querySelectorAll('.date-picker__day:not(.date-picker__day--disabled)');
      days.forEach(day => {
        day.addEventListener('click', () => {
          // Remove previous selection
          calendar.querySelectorAll('.date-picker__day--selected').forEach(d => {
            d.classList.remove('date-picker__day--selected');
          });
          // Add new selection
          day.classList.add('date-picker__day--selected');

          // Update input
          if (!day.classList.contains('date-picker__day--outside')) {
            const dayNum = day.textContent;
            const title = calendar.querySelector('.date-picker__title');
            if (title && input) {
              const [month, year] = title.textContent.split(' ');
              input.value = `${month} ${dayNum}, ${year}`;
            }
          }

          // Close picker
          picker.classList.remove('is-open');
        });
      });
    }
  });
}

// Export for use
if (typeof window !== 'undefined') {
  window.DatePicker = DatePicker;
}
