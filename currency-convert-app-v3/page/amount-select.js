import { createWidget, widget, align, prop } from '@zos/ui'
import { px } from '@zos/utils'
import { back } from '@zos/router'
import { showToast } from '@zos/interaction'
import { LocalStorage } from '@zos/storage'

const localStorage = new LocalStorage()

Page({
  state: {
    displayValue: '100',
    hasDecimal: false
  },

  build() {
    console.log('Amount select page building...')
    
    // Get current amount
    try {
      const params = hmApp.getPageParams && hmApp.getPageParams()
      if (params && params.currentAmount) {
        this.state.displayValue = params.currentAmount
        this.state.hasDecimal = params.currentAmount.includes('.')
      }
    } catch (e) {
      console.log('Error getting params:', e)
    }

    // Background
    createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: px(480),
      h: px(800),
      color: 0x000000
    })

    // Title bar
    createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: px(480),
      h: px(80),
      color: 0x1f2937
    })

    // Back button
    createWidget(widget.BUTTON, {
      x: px(20),
      y: px(20),
      w: px(100),
      h: px(40),
      radius: px(8),
      normal_color: 0x374151,
      press_color: 0x4b5563,
      text: '← Back',
      text_size: px(18),
      color: 0xffffff,
      click_func: () => {
        back()
      }
    })

    // Title
    createWidget(widget.TEXT, {
      x: px(130),
      y: px(20),
      w: px(220),
      h: px(40),
      color: 0xffffff,
      text_size: px(24),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: 'Enter Amount'
    })

    // Display area
    createWidget(widget.FILL_RECT, {
      x: px(40),
      y: px(100),
      w: px(400),
      h: px(80),
      radius: px(12),
      color: 0x1f2937
    })

    // Display text
    this.displayText = createWidget(widget.TEXT, {
      x: px(40),
      y: px(100),
      w: px(400),
      h: px(80),
      color: 0xffffff,
      text_size: px(48),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: this.state.displayValue
    })

    // Keypad layout: 3x4 grid
    const keypad = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['.', '0', '⌫']
    ]

    const startY = 210
    const buttonSize = 120
    const spacing = 20
    const startX = (480 - (buttonSize * 3 + spacing * 2)) / 2

    keypad.forEach((row, rowIndex) => {
      row.forEach((key, colIndex) => {
        const x = startX + colIndex * (buttonSize + spacing)
        const y = startY + rowIndex * (buttonSize + spacing)

        createWidget(widget.BUTTON, {
          x: px(x),
          y: px(y),
          w: px(buttonSize),
          h: px(buttonSize),
          radius: px(16),
          normal_color: key === '⌫' ? 0xef4444 : 0x374151,
          press_color: key === '⌫' ? 0xdc2626 : 0x4b5563,
          text: key,
          text_size: px(40),
          color: 0xffffff,
          click_func: () => {
            this.handleKeyPress(key)
          }
        })
      })
    })

    // Confirm button
    createWidget(widget.BUTTON, {
      x: px(40),
      y: px(730),
      w: px(400),
      h: px(60),
      radius: px(16),
      normal_color: 0x10b981,
      press_color: 0x059669,
      text: 'Confirm',
      text_size: px(28),
      color: 0xffffff,
      click_func: () => {
        this.confirmAmount()
      }
    })

    console.log('Amount select page built')
  },

  handleKeyPress(key) {
    if (key === '⌫') {
      // Backspace
      if (this.state.displayValue.length > 0) {
        const newValue = this.state.displayValue.slice(0, -1)
        if (newValue.length === 0) {
          this.state.displayValue = '0'
        } else {
          this.state.displayValue = newValue
        }
        this.state.hasDecimal = this.state.displayValue.includes('.')
      }
    } else if (key === '.') {
      // Decimal point
      if (!this.state.hasDecimal && this.state.displayValue.length > 0) {
        this.state.displayValue += '.'
        this.state.hasDecimal = true
      }
    } else {
      // Number key
      if (this.state.displayValue === '0') {
        this.state.displayValue = key
      } else if (this.state.displayValue.length < 10) {
        this.state.displayValue += key
      }
    }

    this.displayText.setProperty(prop.TEXT, this.state.displayValue)
  },

  confirmAmount() {
    const amount = parseFloat(this.state.displayValue)
    if (isNaN(amount) || amount <= 0) {
      showToast({
        content: 'Invalid amount'
      })
      return
    }

    // Store the new amount in localStorage with a special key
    localStorage.setItem('newAmount', this.state.displayValue)
    console.log('Stored new amount:', this.state.displayValue)

    showToast({
      content: `Amount: ${this.state.displayValue}`
    })

    setTimeout(() => {
      back()
    }, 300)
  }
})

// Made with Bob
