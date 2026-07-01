import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Navbar from '../Navbar';
import { fetchUserBio, postUserBioRequest, updateUserBio } from './services/editUserBio';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Edit = (props) => {
  const [formData, setFormData] = useState({
    id: null,
    text: '',
    gender: '',
    websiteUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [postUserBio, setPostUserBio] = useState(false);

  useEffect(() => {
    Promise.resolve(fetchUserBio(props.currentUserData.userId)).then((result) => {
      if (result !== null) {
        setFormData({
          id: result.id,
          text: result.text,
          gender: result.gender,
          websiteUrl: result.websiteUrl,
        });
      } else {
        setPostUserBio(true);
      }

      setLoading(false);
    });
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);

    const request = postUserBio ? postUserBioRequest(formData) : updateUserBio(formData);

    Promise.resolve(request)
      .then(() => toast.success('Changes made successfully!'))
      .catch(() => toast.error('Failed to save changes.'))
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

      <div className="mx-auto max-w-2xl px-4 py-10">
        <Card>
          <CardContent className="p-8">
            <h2 className="mb-6 text-lg font-semibold">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-center">
                <Label htmlFor="text" className="sm:text-right">Bio</Label>
                <Input
                  id="text"
                  type="text"
                  name="text"
                  placeholder="Bio"
                  value={formData.text || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-center">
                <Label htmlFor="gender" className="sm:text-right">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.gender || ''}
                  onChange={handleChange}
                >
                  <option value="">Choose gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-center">
                <Label htmlFor="websiteUrl" className="sm:text-right">Website</Label>
                <Input
                  id="websiteUrl"
                  type="text"
                  name="websiteUrl"
                  placeholder="Website URL"
                  value={formData.websiteUrl || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="grid sm:grid-cols-[120px_1fr]">
                <span className="hidden sm:block" />
                <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUserData: state.Login.currentUserData,
  };
};

export default connect(mapStateToProps)(Edit);
