export class Index {
  configureRouter(config, router) {
    config.map([
      {
        route: ["", "list"],
        moduleId: "./list",
        name: "list",
        nav: true,
        title: "Laporan Ekspedisi Pembelian Garment",
      },
    ]);

    this.router = router;
  }
}
