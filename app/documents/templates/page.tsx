// ... existing code ...
const handleSubmitCreate = () => {
  // Validate required fields
  if (!formData.name.trim() || !formData.document_type) {
    alert('Template name and document type are required');
    return;
  }
  
  // Validate field names
  const hasEmptyFields = formData.fields.some(f => !f.name.trim());
  if (hasEmptyFields) {
    alert('All field names must be filled');
    return;
  }

  createTemplate({
    name: formData.name.trim(),
    document_type: formData.document_type,
    description: formData.description,
    fields: formData.fields
  });
};

  const handleSubmitEdit = () => {
    if (!currentTemplate) return;
    
    updateTemplate({
      id: currentTemplate.id,
      name: formData.name,
      document_type: formData.document_type,
      description: formData.description,
      fields: formData.fields,
      updated_at: new Date().toISOString()
    });
  };

  const handleSubmitDelete = () => {
    if (!currentTemplate) return;
    deleteTemplate({ id: currentTemplate.id }, { method: 'DELETE' });
  };

  const handleDuplicateTemplate = (template: Template) => {
    setFormData({
      name: `${template.name} (Copy)`,
      document_type: template.document_type,
      description: template.description || "",
      fields: template.fields
    });
    setIsCreateOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Document Templates</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[42px] w-full" />
              ))}
            </div>
          ) : templates && templates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Fields</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{template.document_type}</TableCell>
                    <TableCell>{template.fields.length} fields</TableCell>
                    <TableCell>{new Date(template.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTemplate(template)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No templates found</h3>
              <p className="text-muted-foreground mt-2">
                Create your first document template to get started.
              </p>
              <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                Create Template
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Template Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Document Template</DialogTitle>
            <DialogDescription>
              Create a new template for document processing
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document_type">Document Type</Label>
                <Select
                  value={formData.document_type}
                  onValueChange={(value) => setFormData({ ...formData, document_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="work_permit">Work Permit</SelectItem>
                    <SelectItem value="medical_certificate">Medical Certificate</SelectItem>
                    <SelectItem value="contract">Employment Contract</SelectItem>
                    <SelectItem value="insurance">Insurance Policy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter template description"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Template Fields</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddField}>
                  <Plus className="h-4 w-4 mr-1" /> Add Field
                </Button>
              </div>
              {formData.fields.map((field, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5 space-y-2">
                    <Label htmlFor={`field-name-${index}`}>Field Name</Label>
                    <Input
                      id={`field-name-${index}`}
                      value={field.name}
                      onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                      placeholder="Field name"
                    />
                  </div>
                  <div className="col-span-4 space-y-2">
                    <Label htmlFor={`field-type-${index}`}>Field Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => handleFieldChange(index, "type", value)}
                    >
                      <SelectTrigger id={`field-type-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="file">File Upload</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={`field-required-${index}`}>Required</Label>
                    <Select
                      value={field.required ? "true" : "false"}
                      onValueChange={(value) => handleFieldChange(index, "required", value === "true")}
                    >
                      <SelectTrigger id={`field-required-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveField(index)}
                      disabled={formData.fields.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCreate}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Document Template</DialogTitle>
            <DialogDescription>
              Update the template details and fields
            </DialogDescription>
          </DialogHeader>
          {/* Same form fields as create dialog */}
          <div className="grid gap-4 py-4">
            {/* ... existing code ...