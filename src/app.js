import $ from 'jquery'
import commaNumber from 'comma-number'
;(async () => {
  const columns = 13
  const data = []

  $('#portfolio_det_eq tbody tr td').each((index, element) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const text = $(element).text().replace(/\n/g, '').replace(/,/g, '').replace(/%/g, '').replace(/円/g, '')

    if (!data[row]) data[row] = {}

    switch (column) {
      case 0:
        // 銘柄コード
        if (text.length == 4 && isNaN(Number(text)) !== true) {
          data[row]['symbol'] = `${text}.T`
          break
        }

        if (text.length == 5 && isNaN(Number(text)) !== true) {
          data[row]['symbol'] = `${text.slice(1, text.length)}.HK`
          break
        }

        if (text === 'RDSB') {
          data[row]['symbol'] = 'RDS-B'
          break
        }

        data[row]['symbol'] = text
        break

      case 1:
        // 銘柄名
        data[row]['name'] = text
        break

      case 2:
        // 保有数
        data[row]['quantity'] = Number(text)
        break

      case 3:
        // 平均取得価格
        data[row]['averageCostPrice'] = Number(text)
        break

      case 4:
        // 現在値
        data[row]['price'] = Number(text)
        break

      case 5:
        // 評価額
        data[row]['value'] = { raw: Number(text), currency: 'JPY' }
        break

      case 6:
        // 前日比
        data[row]['dayBeforeRatio'] = { raw: Number(text), currency: 'JPY' }
        break

      case 7:
        // 評価損益
        data[row]['profitAndLost'] = { raw: Number(text), currency: 'JPY' }
        break

      case 8:
        // 評価損益率
        data[row]['profitAndLost']['percent'] = Number(text)
        break

      case 9:
        // 保有金融機関
        data[row]['securitiesCompany'] = text
        break

      default:
        break
    }
  })

  await Promise.all(
    data.map(async (element, index) => {
      const response = await fetch(`https://dividends-function.vercel.app/api/dividends?symbol=${element.symbol}`).then(
        async (response) => {
          return await response.json()
        }
      )

      data[index]['price'] = {
        raw: data[index]['price'],
        currency: response.currency,
      }

      data[index]['averageCostPrice'] = {
        raw: data[index]['averageCostPrice'],
        currency: response.currency,
      }

      data[index]['dividend'] = {
        raw: response.dividend,
        currency: response.currency,
      }
    })
  )

  console.log(data)

  const detailsTag = `
    <details id="diviend-forward" style="margin-bottom: 24px;">
      <summary>配当情報</summary>

      <h1 id="total-dividends" class="heading-small"></h1>

      <table>
        <thead>
          <tr>
            <th>シンボル</th>
            <th>銘柄名</th>
            <th>現在値</th>
            <th>保有数</th>
            <th>1株配当金</th>
            <th>総配当金</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </details>
  `

  $('#portfolio_det_eq .table').before(detailsTag)

  data.map((element) => {
    const appendTag = `
      <tr>
        <td>${element.symbol}</td>
        <td>${element.name}</td>
        <td>${element.price.raw} ${element.price.currency}</td>
        <td>${element.quantity}</td>
        <td>${element.dividend.raw} ${element.dividend.currency}</td>
        <td>${Math.round(element.dividend.raw * element.quantity * 100) / 100} ${element.dividend.currency}</td>
      </tr>
    `

    $('#diviend-forward table tbody').append(appendTag)
  })

  const totalDividends = data.reduce((prev, current) => {
    if (current.dividend.currency === 'JPY') {
      return prev + current.dividend.raw * current.quantity
    }

    if (current.dividend.currency === 'USD') {
      return prev + current.dividend.raw * current.quantity * 105
    }

    return prev
  }, 0)

  $('#total-dividends').text(`年間配当金（予想）：${commaNumber(Math.floor(totalDividends))}円`)
})()
