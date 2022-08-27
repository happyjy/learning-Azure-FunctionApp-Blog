import { CosmosClient } from "@azure/cosmos";

// Set connection string from CONNECTION_STRING value in local.settings.json
const CONNECTION_STRING = process.env.CONNECTION_STRING;

const articleService = {
  init() {
    // DB 초기화
    // cosmos -> data -> container
    try {
      this.client = new CosmosClient(CONNECTION_STRING);
      this.database = this.client.database("academy2");
      this.container = this.database.container("articles");
    } catch (err) {
      console.log(err.message);
    }
  },

  async create(articleToCreate) {
    const { resource } = await this.container.items.create(articleToCreate);
    return resource;
  },

  async readAll(): Promise<string> {
    const iterator = this.container.items.readAll();
    const { resources } = await iterator.fetchAll();
    return resources;
  },

  async read(id, ipaddress): Promise<string> {
    const item = this.container.item(id, ipaddress);
    const article = await item.read();
    return article.resource;
  },

  async update(article) {
    const { resource } = await this.container.item(article.id).replace(article);
    return resource;
  },

  async delete(id, ipaddress) {
    const result = await this.container.item(id, ipaddress).delete();
  },
};

articleService.init();

export default articleService;
