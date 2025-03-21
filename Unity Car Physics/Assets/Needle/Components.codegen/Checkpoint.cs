
using UnityEngine;
namespace Needle.Typescript.GeneratedComponents
{
	public partial class Checkpoint : UnityEngine.MonoBehaviour
	{
		private void OnDrawGizmos()
		{
			var t = transform;
			Gizmos.matrix = Matrix4x4.TRS(t.position, t.rotation, t.localScale);
			Gizmos.color = Color.yellow;
			Gizmos.DrawWireCube(Vector3.zero, Vector3.one);
		}
	}
}



// NEEDLE_CODEGEN_START
// auto generated code - do not edit directly

#pragma warning disable

namespace Needle.Typescript.GeneratedComponents
{
	public partial class Checkpoint : UnityEngine.MonoBehaviour
	{
		public void setHighlight(bool @highlight){}
	}
}

// NEEDLE_CODEGEN_END


