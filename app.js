(async () => {
  const columns = 13;
  const data = [];

  $("#portfolio_det_eq tbody tr td").each((index, element) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const text = $(element).text();

    if (!data[row]) data[row] = {};

    switch (column) {
      case 0:
        // 銘柄コード
        data[row]["symbol"] = text;
        break;

      case 1:
        // 銘柄名
        data[row]["name"] = text;
        break;

      case 2:
        // 保有数
        data[row]["quantity"] = text;
        break;

      case 3:
        // 平均取得価格
        data[row]["averageCostPrice"] = text;
        break;

      case 4:
        // 現在地
        data[row]["price"] = text;
        break;

      case 5:
        // 評価額
        data[row]["value"] = text;
        break;

      case 6:
        // 評価損益
        data[row]["profitAndLost"] = text;
        break;

      case 7:
        // 評価損益
        data[row]["profitAndLost"] = text;
        break;

      case 8:
        // 評価損益率
        data[row]["profitAndLostPercent"] = text;
        break;

      case 9:
        // 保有金融機関
        data[row]["securitiesCompany"] = text;
        break;

      default:
        break;
    }
  });

  // TODO: 配当情報を取得する
})();
