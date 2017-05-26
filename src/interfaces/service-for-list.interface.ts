interface ServiceForListInterface {
  getList(searchTerm: string, searchFieldName: string): Promise<any[]>;
  getDescriptionById(id: string): Promise<string>;
}
