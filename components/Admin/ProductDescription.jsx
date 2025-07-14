"use client";
import React, { useState, useEffect } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import { Extension } from '@tiptap/core'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  PilcrowSquare,
} from 'lucide-react'

// Create a FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addCommands() {
    return {
      setFontSize: (fontSize) => ({ commands }) => {
        return commands.setFontStyle({ fontSize })
      },
      unsetFontSize: () => ({ commands }) => {
        return commands.setFontStyle({ fontSize: undefined })
      },
    }
  },
})
const ProductDescription = ({ productData, packageId }) => {
  const [overview, setOverview] = useState("");
  const [fetchedOverview, setFetchedOverview] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Typography,
      TextAlign,
      Underline,
      Link,
      Color,
      ListItem,
      FontSize,
    ],
    content: "", // Always start empty
    editorProps: {
      attributes: {
        class: 'min-h-[200px] border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00b67a]'
      }
    },
    onUpdate: ({ editor }) => {
      setOverview(editor.getHTML());
    }
  });

  // Save handler for form submission
  const saveDescription = async () => {
    if (!packageId || !overview) {
      toast.error('Please provide an overview and valid product.');
      return;
    }
    setLoading(true);
    try {
      if (editMode && editId) {
        // PATCH request for update
        const res = await fetch('/api/productDescription', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packageId: editId, overview })
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          toast.error(data.error || 'Failed to update product info');
        } else {
          toast.success('Product info updated successfully!');
          setOverview("");
          setEditMode(false);
          setEditId(null);
          fetchProductDescription();
        }
      } else {
        // POST request for create
        const res = await fetch('/api/productDescription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packageId, overview })
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          toast.error(data.error || 'Failed to save product info');
        } else {
          toast.success('Product info saved successfully!');
          setOverview("");
          fetchProductDescription();
        }
      }
    } catch (err) {
      toast.error('Error saving product info.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveDescription();
  };

  // Set editor content after fetching description (not on every keystroke)
  useEffect(() => {
    if (editor && typeof fetchedOverview === "string") {
      editor.commands.setContent(fetchedOverview || "");
    }
  }, [editor, fetchedOverview]);
  const [tableLoading, setTableLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [viewedDesc, setViewedDesc] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const productTitle = productData?.title || "";

  const [loading, setLoading] = useState(false);

  // Fetch only the current product's description
  const fetchProductDescription = async () => {
    if (!packageId) {
      setOverview("");
      return;
    }
    setTableLoading(true);
    try {
      const res = await fetch(`/api/productDescription?packageId=${packageId}`);
      const data = await res.json();
      if (res.ok && data.description && data.description.overview) {
        setFetchedOverview(data.description.overview);
      } else {
        setFetchedOverview("");
      }
    } catch (err) {
      setOverview("");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDescription();
  }, [packageId]);

  return (
    <div>
      <form className="page-content" onSubmit={handleSubmit}>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-md-12 col-lg-12">
              <h3 className="my-4 text-center">Package Description</h3>
              <div className="card my-2">
                <div className="card-body px-4 py-2">
                  <div className="mb-4">
                    <label className="font-semibold">Package Name</label>
                    <Input
                      type="text"
                      className="form-control"
                      value={productTitle}
                      disabled
                      readOnly
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Package Over View Description</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button type="button"
                          onClick={() => editor?.chain().focus().toggleBold().run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().toggleItalic().run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().toggleUnderline().run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('underline') ? 'bg-gray-200' : ''}`}
                        >
                          <UnderlineIcon className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().setParagraph().run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('paragraph') ? 'bg-gray-200' : ''}`}
                        >
                          <PilcrowSquare className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
                        >
                          <Heading1 className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
                        >
                          <Heading2 className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
                        >
                          <Heading3 className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().toggleBulletList().run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                        >
                          <ListOrdered className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('blockquote') ? 'bg-gray-200' : ''}`}
                        >
                          <Quote className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
                        >
                          <Code className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().toggleStrike().run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('strike') ? 'bg-gray-200' : ''}`}
                        >
                          <Strikethrough className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().undo().run()}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          <Undo className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().redo().run()}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          <Redo className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('textAlign', 'left') ? 'bg-gray-200' : ''}`}
                        >
                          <AlignLeft className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('textAlign', 'center') ? 'bg-gray-200' : ''}`}
                        >
                          <AlignCenter className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                          className={`p-2 rounded-lg hover:bg-gray-100 ${editor?.isActive('textAlign', 'right') ? 'bg-gray-200' : ''}`}
                        >
                          <AlignRight className="w-4 h-4" />
                        </button>
                      </div>
                      <EditorContent editor={editor} />
                    </div>
                  </div>
                  <div className="text-center">
                    <Button type="submit" className="bg-red-500 px-5" disabled={loading}>
                      {editMode ? (loading ? 'Updating...' : 'Update') : (loading ? 'Saving...' : 'Data Save')}
                    </Button>
                    {editMode && (
                      <Button type="button" className="ml-3 bg-gray-400 px-5" onClick={() => { setEditMode(false); setEditId(null); setOverview(""); }} disabled={loading}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductDescription;