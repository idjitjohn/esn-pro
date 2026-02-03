import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPost {
  url: string
  comments: string[]
}

export interface IProspect extends Document {
  link: string
  name?: string
  image?: string
  data?: any
  message?: string
  posts?: IPost[]
  prospected: boolean
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    url: { type: String, required: true },
    comments: { type: [String], default: [] },
  },
  { _id: false }
)

const ProspectSchema = new Schema<IProspect>(
  {
    link: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    data: { type: Schema.Types.Mixed, default: {} },
    message: { type: String, default: '' },
    posts: { type: [PostSchema], default: [] },
    prospected: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Prospect: Model<IProspect> =
  (mongoose.models.Prospect as Model<IProspect>) ||
  mongoose.model<IProspect>('Prospect', ProspectSchema)

export default Prospect
