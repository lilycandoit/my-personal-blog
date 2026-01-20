-- CreateIndex
CREATE INDEX "Post_visibility_idx" ON "Post"("visibility");

-- CreateIndex
CREATE INDEX "Post_featured_idx" ON "Post"("featured");

-- CreateIndex
CREATE INDEX "Post_updatedAt_idx" ON "Post"("updatedAt");

-- CreateIndex
CREATE INDEX "Post_visibility_featured_idx" ON "Post"("visibility", "featured");

-- CreateIndex
CREATE INDEX "Post_visibility_updatedAt_idx" ON "Post"("visibility", "updatedAt");

-- CreateIndex
CREATE INDEX "Project_builtDate_idx" ON "Project"("builtDate");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");
