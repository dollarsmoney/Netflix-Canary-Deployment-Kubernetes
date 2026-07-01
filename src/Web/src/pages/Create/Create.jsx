import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, ImagePlus } from 'lucide-react';
import Navbar from '../../common/components/Navbar';
import CreatePost from './services/createPost';
import TokenChecker from '../../common/helpers/TokenChecker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Create = (props) => {
  const [post, setPost] = useState({
    caption: '',
    file: {},
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const tokenValidator = TokenChecker();

    if (tokenValidator === false) {
      props.history.push('/');
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (event) => {
    event.target.name === 'file'
      ? setPost({
          ...post,
          file: event.target.files[0],
        })
      : setPost({
          ...post,
          [event.target.name]: event.target.value,
        });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('Caption', post.caption);
    data.append('File', post.file);

    Promise.resolve(CreatePost(data))
      .then(() => {
        toast.success('Post created!');
        setPost({ caption: '', file: {} });
      })
      .catch(() => toast.error('Failed to create post.'))
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">Create a Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  type="text"
                  name="caption"
                  placeholder="Write a caption..."
                  value={post.caption}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Image / Video</Label>
                <label
                  htmlFor="file"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input py-10 text-sm text-muted-foreground transition hover:bg-accent"
                >
                  <ImagePlus className="h-8 w-8" />
                  {post.file && post.file.name ? post.file.name : 'Click to select a file'}
                </label>
                <input id="file" type="file" name="file" className="hidden" onChange={handleChange} />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Share'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Create;
