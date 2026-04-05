import { createWidget, widget, align, text_style, prop } from '@zos/ui'
import { px } from '@zos/utils'
import { LocalStorage } from '@zos/storage'
import { showToast } from '@zos/interaction'
import { push } from '@zos/router'

// Currency data with exchange rates (base: USD)
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.88 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 }
]

const localStorage = new LocalStorage()

Page({
  state: {
    amount: '100',
    fromCurrencyIndex: 0,
    toCurrencyIndex: 5,
    result: '8312.00'
  },

  onShow() {
    // Check if returning from amount selection page
    try {
      const newAmount = localStorage.getItem('newAmount')
      console.log('onShow - checking for new amount:', newAmount)
      
      if (newAmount) {
        console.log('Updating amount to:', newAmount)
        this.state.amount = newAmount
        
        // Update the display
        if (this.amountText) {
          this.amountText.setProperty(prop.TEXT, newAmount)
        }
        
        // Perform conversion and save
        this.performConversion()
        this.saveState()
        
        // Clear the temporary value
        localStorage.removeItem('newAmount')
        
        showToast({
          content: `Updated: ${newAmount}`
        })
      }
    } catch (e) {
      console.log('Error in onShow:', e)
    }
  },

  build() {
    // Load saved state
    this.loadState()
    
    // Check for new values from other pages BEFORE creating widgets
    const newAmount = localStorage.getItem('newAmount')
    if (newAmount) {
      console.log('Found new amount in build:', newAmount)
      this.state.amount = newAmount
      localStorage.removeItem('newAmount')
    }
    
    const newFromCurrency = localStorage.getItem('newFromCurrency')
    if (newFromCurrency) {
      console.log('Found new from currency:', newFromCurrency)
      this.state.fromCurrencyIndex = parseInt(newFromCurrency)
      localStorage.removeItem('newFromCurrency')
    }
    
    const newToCurrency = localStorage.getItem('newToCurrency')
    if (newToCurrency) {
      console.log('Found new to currency:', newToCurrency)
      this.state.toCurrencyIndex = parseInt(newToCurrency)
      localStorage.removeItem('newToCurrency')
    }
    
    // Title
    createWidget(widget.TEXT, {
      x: 0,
      y: px(30),
      w: px(480),
      h: px(50),
      color: 0xffffff,
      text_size: px(28),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: 'Currency Converter'
    })

    // Amount label
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(100),
      w: px(400),
      h: px(35),
      color: 0xaaaaaa,
      text_size: px(22),
      text: 'Amount:'
    })

    // Amount display
    this.amountText = createWidget(widget.TEXT, {
      x: px(40),
      y: px(135),
      w: px(300),
      h: px(55),
      color: 0xffffff,
      text_size: px(36),
      text: this.state.amount,
      text_style: text_style.ELLIPSIS
    })

    // Edit amount button
    createWidget(widget.BUTTON, {
      x: px(350),
      y: px(135),
      w: px(90),
      h: px(55),
      radius: px(12),
      normal_color: 0x3b82f6,
      press_color: 0x2563eb,
      text: 'Edit',
      text_size: px(20),
      color: 0xffffff,
      click_func: () => {
        this.showAmountPicker()
      }
    })

    // From currency label
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(210),
      w: px(400),
      h: px(35),
      color: 0xaaaaaa,
      text_size: px(22),
      text: 'From:'
    })

    // From currency button
    this.fromCurrencyBtn = createWidget(widget.BUTTON, {
      x: px(40),
      y: px(245),
      w: px(400),
      h: px(65),
      radius: px(12),
      normal_color: 0x1f2937,
      press_color: 0x374151,
      text: this.getCurrencyDisplay(this.state.fromCurrencyIndex),
      text_size: px(24),
      color: 0xffffff,
      click_func: () => {
        this.showCurrencyPicker(true)
      }
    })

    // Swap button
    createWidget(widget.BUTTON, {
      x: px(190),
      y: px(330),
      w: px(100),
      h: px(55),
      radius: px(28),
      normal_color: 0x10b981,
      press_color: 0x059669,
      text: '⇅',
      text_size: px(32),
      color: 0xffffff,
      click_func: () => {
        this.swapCurrencies()
      }
    })

    // To currency label
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(405),
      w: px(400),
      h: px(35),
      color: 0xaaaaaa,
      text_size: px(22),
      text: 'To:'
    })

    // To currency button
    this.toCurrencyBtn = createWidget(widget.BUTTON, {
      x: px(40),
      y: px(440),
      w: px(400),
      h: px(65),
      radius: px(12),
      normal_color: 0x1f2937,
      press_color: 0x374151,
      text: this.getCurrencyDisplay(this.state.toCurrencyIndex),
      text_size: px(24),
      color: 0xffffff,
      click_func: () => {
        this.showCurrencyPicker(false)
      }
    })

    // Result label
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(530),
      w: px(400),
      h: px(35),
      color: 0xaaaaaa,
      text_size: px(22),
      text: 'Result:'
    })

    // Result display
    this.resultText = createWidget(widget.TEXT, {
      x: px(40),
      y: px(565),
      w: px(400),
      h: px(75),
      color: 0x10b981,
      text_size: px(44),
      text: this.state.result,
      text_style: text_style.WRAP
    })


    // Initial conversion
    this.performConversion()
  },

  getCurrencyDisplay(index) {
    const currency = CURRENCIES[index]
    return `${currency.code} - ${currency.name}`
  },

  showAmountPicker() {
    // Navigate to custom amount selection page
    push({
      url: 'page/amount-select',
      params: {
        currentAmount: this.state.amount
      }
    })
  },

  showCurrencyPicker(isFrom) {
    // Navigate to the appropriate currency selection page
    if (isFrom) {
      push({
        url: 'page/from-currency-select'
      })
    } else {
      push({
        url: 'page/to-currency-select'
      })
    }
  },

  swapCurrencies() {
    const temp = this.state.fromCurrencyIndex
    this.state.fromCurrencyIndex = this.state.toCurrencyIndex
    this.state.toCurrencyIndex = temp
    
    this.fromCurrencyBtn.setProperty(prop.TEXT, this.getCurrencyDisplay(this.state.fromCurrencyIndex))
    this.toCurrencyBtn.setProperty(prop.TEXT, this.getCurrencyDisplay(this.state.toCurrencyIndex))
    
    this.performConversion()
    this.saveState()
    
    showToast({
      content: 'Currencies swapped!'
    })
  },

  performConversion() {
    console.log('performConversion called, state:', JSON.stringify(this.state))
    
    const amount = parseFloat(this.state.amount)
    if (isNaN(amount) || amount <= 0) {
      this.resultText.setProperty(prop.TEXT, '0.00')
      return
    }

    // Validate currency indices
    const fromIndex = parseInt(this.state.fromCurrencyIndex)
    const toIndex = parseInt(this.state.toCurrencyIndex)
    
    console.log('Currency indices - from:', fromIndex, 'to:', toIndex, 'CURRENCIES.length:', CURRENCIES.length)
    
    if (isNaN(fromIndex) || isNaN(toIndex) || fromIndex < 0 || fromIndex >= CURRENCIES.length || toIndex < 0 || toIndex >= CURRENCIES.length) {
      console.log('Invalid currency index:', fromIndex, toIndex)
      this.resultText.setProperty(prop.TEXT, 'Error')
      return
    }

    const fromCurrency = CURRENCIES[fromIndex]
    const toCurrency = CURRENCIES[toIndex]
    
    console.log('fromCurrency:', fromCurrency, 'toCurrency:', toCurrency)
    
    // Convert to USD first, then to target currency
    const amountInUSD = amount / fromCurrency.rate
    const result = amountInUSD * toCurrency.rate
    
    this.state.result = result.toFixed(2)
    this.resultText.setProperty(prop.TEXT, `${toCurrency.symbol}${this.state.result}`)
  },

  saveState() {
    localStorage.setItem('amount', this.state.amount)
    localStorage.setItem('fromCurrencyIndex', this.state.fromCurrencyIndex)
    localStorage.setItem('toCurrencyIndex', this.state.toCurrencyIndex)
  },

  loadState() {
    try {
      const savedAmount = localStorage.getItem('amount')
      const savedFrom = localStorage.getItem('fromCurrencyIndex')
      const savedTo = localStorage.getItem('toCurrencyIndex')
      
      console.log('Raw localStorage values:', savedAmount, savedFrom, savedTo)
      
      this.state.amount = savedAmount || '100'
      
      // Parse and validate fromCurrencyIndex
      if (savedFrom !== null && savedFrom !== undefined && savedFrom !== '') {
        const parsed = parseInt(savedFrom)
        this.state.fromCurrencyIndex = isNaN(parsed) ? 0 : parsed
      } else {
        this.state.fromCurrencyIndex = 0
      }
      
      // Parse and validate toCurrencyIndex
      if (savedTo !== null && savedTo !== undefined && savedTo !== '') {
        const parsed = parseInt(savedTo)
        this.state.toCurrencyIndex = isNaN(parsed) ? 5 : parsed
      } else {
        this.state.toCurrencyIndex = 5
      }
      
      console.log('Final loaded state:', JSON.stringify(this.state))
    } catch (e) {
      console.log('Error loading state:', e)
      // Set defaults on error
      this.state.amount = '100'
      this.state.fromCurrencyIndex = 0
      this.state.toCurrencyIndex = 5
    }
  }
})

// Made with Bob
