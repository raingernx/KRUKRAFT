import type { Meta, StoryObj } from "@storybook/nextjs";

import { FileUploadWidget } from "./FileUploadWidget";

const meta = {
  title: "Components/FileUploadWidget",
  component: FileUploadWidget,
  tags: ["autodocs"],
  args: {
    resourceId: "resource_storybook_1",
  },
} satisfies Meta<typeof FileUploadWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const UploadedState: Story = {
  args: {
    resourceId: "resource_storybook_2",
    initialFileName: "science-assessment-pack.zip",
    initialFileSize: 5242880,
  },
};

export const CustomCopy: Story = {
  args: {
    resourceId: "resource_storybook_3",
    copy: {
      dragAndDrop: "Drop the classroom bundle here or click to browse",
      formats: "PDF, DOCX, ZIP — up to 50 MB",
      uploadFile: "Upload classroom file",
      uploadSuccess: "Classroom file uploaded successfully.",
    },
  },
};
