import { createWidget, widget, align, prop } from '@zos/ui'
import { px } from '@zos/utils'
import { back } from '@zos/router'
import { showToast } from '@zos/interaction'
import { LocalStorage } from '@zos/storage'

const localStorage = new LocalStorage()

// Currency data
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' }
]

Page({
  state: {
    selectedIndex: 0
  },

  build() {
    console.log('From currency select page building...')
    
    // Get current selection
    const currentIndex = localStorage.getItem('fromCurrencyIndex')
    if (currentIndex) {
      this.state.selectedIndex = parseInt(currentIndex)
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
      text_size: px(22),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: 'From Currency'
    })

    // Currency list
    let yPos = 100
    const buttonHeight = 70
    const spacing = 10

    CURRENCIES.forEach((currency, index) => {
      const isSelected = index === this.state.selectedIndex

      createWidget(widget.BUTTON, {
        x: px(40),
        y: px(yPos),
        w: px(400),
        h: px(buttonHeight),
        radius: px(12),
        normal_color: isSelected ? 0x3b82f6 : 0x1f2937,
        press_color: isSelected ? 0x2563eb : 0x374151,
        text: `${currency.code} ${currency.symbol} - ${currency.name}`,
        text_size: px(22),
        color: 0xffffff,
        click_func: () => {
          console.log('FROM currency selected:', index, currency.code)
          localStorage.setItem('newFromCurrency', index.toString())
          
          showToast({
            content: `From: ${currency.code}`
          })

          setTimeout(() => {
            back()
          }, 300)
        }
      })

      yPos += buttonHeight + spacing
    })

    console.log('From currency select page built')
  }
})

// Made with Bob
