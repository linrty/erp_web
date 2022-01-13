const Mock = require('mockjs')

module.exports = [
    {
        url: '/vue-element-admin/account',
        type: 'get',
        response: config => {
            const { type } = config.query
            if (type === 'month'){
                return {
                    code: 20000,
                    data: {
                        sta_month: '5',
                        sta_year: '2019',
                        sta_quarter: '',
                        end_month: '7',
                        end_year: '2021',
                        end_quarter: '',
                        'number|27': ['@integer(1,100)'],
                        'price|27': ['@integer(100,100000)']
                    }
                }
            }else if (type === 'year'){
                return {
                    code: 20000,
                    data: {
                        sta_month: '',
                        sta_year: '2019',
                        sta_quarter: '',
                        end_month: '',
                        end_year: '2021',
                        end_quarter: '',
                        'number|3': ['@integer(1,100)'],
                        'price|3': ['@integer(100,100000)']
                    }
                }
            }else{
                return {
                    code: 20000,
                    data: {
                        sta_month: '',
                        sta_year: '2019',
                        sta_quarter: '2',
                        end_month: '',
                        end_year: '2021',
                        end_quarter: '4',
                        'number|11': ['@integer(1,100)'],
                        'price|11': ['@integer(100,100000)']
                    }
                }
            }
          }
    }
]